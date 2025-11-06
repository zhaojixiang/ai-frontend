import QRCode from 'qrcode';
import qs from 'query-string';

import { getAliExist } from '@/lib/utils';
import { billCheckOutByToken, getTokenForBillCheckOut } from '@/services/api/orderPay';
import { getEnvEnum } from '@/services/common';
import { FROUNT_URL } from '@/services/config';

import AliPayScan from './components/AliPayScan';
import GuidePop from './components/GuidePop';
import ScanPayPop from './components/ScanPayPop';

// 110: '支付宝在线支付'
// 111: '支付宝当面支付'
// 141: '微信(中行)'

type AliPreparePayProps = {
  payWay: number;
  orderPayId: number;
  aliCashierType: string;
  curStage: any;
  orderId: string;
  totalAmount: string;
  orderType: 'learning_pay' | undefined;
  curRoute: string;
  token: string;
  alipayExist: boolean;
  scanPayMethods: { code: 111 | 142 };
  showPayModel: (props: {
    scanUrl: string;
    totalAmount: string;
    payWay: number;
    token?: string;
  }) => void;
};

// 支付宝token支付
const aliPreparePay = async ({ token }: { token: string }) => {
  if (!token) {
    JOJO.toast.show({ content: '没获取到支付token', duration: 2000, icon: 'fail' });
    return;
  }

  try {
    const response = await billCheckOutByToken({ token });
    const { data: resData, errorMessage } = response;
    const { data, payWay } = resData || {};

    if (!resData || !data) {
      JOJO.toast.show({ content: errorMessage || '系统开小差啦', duration: 2000, icon: 'fail' });
      return;
    }

    const { content } = data;
    if (!content) {
      JOJO.toast.show({ content: '创建支付宝预付单失败!', duration: 2000, icon: 'fail' });
      return;
    }
    if (String(payWay) === '140') {
      // 如果是中行
      window.location.replace(content);
      return;
    }
    // 获取到支付宝支付表单以及自动提交脚本添加到dom并自动提交
    const div = document.createElement('div');
    div.innerHTML = content;
    document.body.appendChild(div);
    if (document.forms[0]) {
      document.forms[0].submit();
    } else {
      JOJO.toast.show({ content: '支付表单异常', duration: 2000, icon: 'fail' });
    }
  } catch (error) {
    console.error('支付处理失败:', error);
    JOJO.toast.show({ content: '支付处理失败', duration: 2000, icon: 'fail' });
  }
};

/**
 * 处理支付宝在线支付和支付宝中行支付 (payWay: 110, 140)
 */
async function handleAlipayOnlinePay(props: AliPreparePayProps): Promise<boolean> {
  const { payWay, token, alipayExist } = props;
  console.log(JOJO.Os.app, alipayExist);

  if (JOJO.Os.app) {
    if (alipayExist) {
      // 直接拉起支付宝支付
      await aliPreparePay({ token });
      return true;
    } else {
      // 未安装支付宝时，生成支付二维码
      // 检测功能只在app有效，app内不接入中行
      try {
        const response = await billCheckOutByToken({ token });
        const { data: payData } = response.data || {};
        const { amount, hasPaid, content } = payData || {};

        if (hasPaid) {
          return true;
        }
        if (content) {
          const decodedString = decodeURIComponent(content);

          const scanUrl = btoa(encodeURIComponent(decodedString));
          const popup = JOJO.popup(
            <ScanPayPop
              url={scanUrl}
              totalAmount={amount || '0.00'}
              payWay={payWay}
              onClose={() => popup.destroy()}
            />,
            {
              animate: false,
              bodyStyle: {
                width: '100vw',
                height: '100vh',
                borderRadius: 0,
                margin: 0,
                backgroundColor: '#fff'
              }
            }
          );
          return true;
        } else {
          JOJO.toast.show({ content: '获取支付二维码失败', duration: 2000, icon: 'fail' });
          return false;
        }
      } catch (error) {
        console.error('获取支付二维码失败:', error);
        JOJO.toast.show({ content: '获取支付二维码失败', duration: 2000, icon: 'fail' });
        return false;
      }
    }
  } else if (JOJO.Os.wechatBrowser) {
    JOJO.navigate('/order/create', {
      params: {
        ...JOJO.Utils.getQuery(),
        from: 'alipay_in_wx'
      },
      mode: 'replace'
    });
    const popup = JOJO.popup(
      <GuidePop
        onClose={() => {
          popup.destroy();
        }}
      />,
      {
        animate: false,
        bodyStyle: {
          width: '100vw',
          height: '100vh',
          borderRadius: 0,
          margin: 0,
          backgroundColor: 'transparent'
        }
      }
    );
    return true;
  } else {
    await aliPreparePay({ token });
    return true;
  }
}

/**
 * 支付宝扫码付
 */
async function handleAliScanPay(token: string): Promise<void> {
  let detail;
  try {
    const res = await billCheckOutByToken({ token });
    const { data } = res || {};
    if (res?.resultCode === 200) {
      if (data.hasPaid) {
        return;
      }
      // 有content url才能生成二维码
      if (data.data.content) {
        const aliPayUrl = data.data.content;
        QRCode.toDataURL(aliPayUrl, { margin: 0 })
          .then((url) => {
            detail = { ...data.data, content: url };
            const popup = JOJO.popup(
              <AliPayScan
                onClose={() => {
                  popup.destroy();
                }}
                info={detail}
              />,
              {
                animate: true,
                bodyStyle: {
                  width: '100vw',
                  height: '100vh',
                  borderRadius: 0,
                  margin: 0,
                  backgroundColor: 'transparent'
                }
              }
            );
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * 支付宝获取支付token
 * @param props AliPreparePayProps
 * @returns
 */
export const aliPay = async (props: AliPreparePayProps) => {
  const { orderPayId, scanPayMethods, curRoute = '/order/create', payWay } = props;

  try {
    const alipayExist = await getAliExist();
    const payEnv = await getEnvEnum();
    // 统一获取支付信息
    const params = {
      // 当前支付方式为 支付宝支付 ，但用户未安装支付宝时，用扫码付替换
      payWay: payWay === 110 && !alipayExist ? scanPayMethods.code || 111 : payWay,
      backUrl: `${FROUNT_URL}${curRoute}?${qs.stringify({
        ...JOJO.Utils.getQuery(),
        isAlreadyCreateOrder: '1'
      })}`,
      payBillId: orderPayId,
      payEnv
    };

    const { data } = await getTokenForBillCheckOut(params);

    if (!data) {
      JOJO.toast.show({ content: '获取支付链接失败', duration: 2000, icon: 'fail' });
      return;
    }
    // 根据不同的支付方式处理
    if (String(payWay) === '110' || String(payWay) === '140') {
      // 支付宝在线支付, 支付宝中行
      await handleAlipayOnlinePay({ ...props, token: data, alipayExist });
    } else {
      // 支付宝扫码付
      handleAliScanPay(data);
    }
  } catch (error) {
    console.error('支付处理异常:', error);
    JOJO.toast.show({ content: '支付处理异常', duration: 2000, icon: 'fail' });
  }
};
