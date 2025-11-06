import qs from 'query-string';

import { getWxExist } from '@/lib/utils';
import { billCheckOut } from '@/services/api/orderPay';
import { getEnvEnum } from '@/services/common';
import { FROUNT_URL, FROUNT_URL_OLD } from '@/services/config';

import ScanPayPop from './components/ScanPayPop';

// 微信支付方式枚举
const WX_PAY_WAYS = {
  WECHAT_PAY: 101, // 微信支付
  WECHAT_AUTO_RENEW: 102, // 微信自动续费
  WECHAT_CMB: 130, // 微信(招行聚合支付)
  WECHAT_BOC: 141 // 微信(中行)
} as const;

export interface WxPayProps {
  payWay: number;
  shizi_url: any;
  orderId: string;
  orderPayId: number;
  curRoute?: string;
  totalAmount: string;
  isNativeWx?: boolean;
}

interface WxPayConfig {
  package?: string;
  packageValue?: string;
  [key: string]: any;
}

interface WxPayCallbackParams {
  config: WxPayConfig;
  callback: (status: string) => void;
}

interface HandleMiniProgramPayParams {
  payConfigData: any;
  orderId: string;
  curRoute: string;
}

interface HandleAppPayParams {
  payConfigData: any;
  orderId: string;
  orderPayId: number;
  totalAmount: string;
  shizi_url: any;
  payWay: number;
}

interface HandleWechatBrowserPayParams {
  payWay: number;
  payConfigData: any;
  orderId: string;
  orderPayId: number;
  shizi_url: any;
  curRoute: string;
}

interface HandleNativeWxPayParams {
  payConfigData: any;
  orderId: string;
  orderPayId: number;
  shizi_url: any;
  curRoute: string;
  isNativeWx: boolean;
}

interface ParamsType {
  backUrl: string;
  wechatAppId: string;
  payBillId: number;
  payEnv: number | string;
  payWay: number;
}

/**
 * 微信支付核心函数
 * @param params 支付参数对象
 */
function WxPayCore({ config, callback }: WxPayCallbackParams) {
  function onBridgeReady() {
    const newConfig = { ...config };
    // 兼容处理 package 字段
    if (!newConfig.package) {
      newConfig.package = newConfig.packageValue;
      delete newConfig.packageValue;
    }

    WeixinJSBridge.invoke('getBrandWCPayRequest', newConfig, (res: any) => {
      switch (res.err_msg) {
        // 支付成功
        case 'get_brand_wcpay_request:ok':
          callback('ok');
          break;
        // 用户取消支付
        case 'get_brand_wcpay_request:cancel':
          callback('oh');
          break;
        // 支付失败
        case 'get_brand_wcpay_request:fail':
          callback('oh');
          break;
        default:
          // 未知状态，当作失败处理
          callback('oh');
          break;
      }
    });
  }

  if (typeof WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    } else if ((document as any).attachEvent) {
      (document as any).attachEvent('WeixinJSBridgeReady', onBridgeReady);
      (document as any).attachEvent('onWeixinJSBridgeReady', onBridgeReady);
    }
  } else {
    onBridgeReady();
  }
}

/**
 * 处理小程序支付
 */
function handleMiniProgramPay({ payConfigData, orderId, curRoute }: HandleMiniProgramPayParams) {
  const url = '/pages/pkgs/course_about/pages/request_payment/main';
  JOJO.navigate(url, {
    params: {
      ...payConfigData,
      orderId,
      backUrl: `${FROUNT_URL}${curRoute}?${qs.stringify({
        ...JOJO.Utils.getQuery()
      })}`
    },
    to: 'mini'
  });
}

/**
 * 处理App内支付
 */
async function handleAppPay({
  payConfigData,
  orderId,
  orderPayId,
  totalAmount,
  shizi_url,
  payWay
}: HandleAppPayParams) {
  const wechatExist = await getWxExist();
  const redirectUrl = encodeURIComponent(window.location.href);
  const wechatPayUrl = `${payConfigData.mwebUrl}&redirect_url=${redirectUrl}`;

  if (wechatExist) {
    // 跳转微信支付h5页面
    window.location.replace(wechatPayUrl);
  } else {
    // 展示扫码支付弹窗
    const { amount } = payConfigData;
    const scanUrl = window.btoa(
      `${FROUNT_URL_OLD}/order/pending?${qs.stringify({
        orderId,
        orderPayId,
        totalAmount,
        isEntity: true,
        shizi_url,
        preFetch: !wechatExist
      })}`
    );

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
  }
}

/**
 * 处理微信浏览器支付
 */
function handleWechatBrowserPay({
  payWay,
  payConfigData,
  orderId,
  orderPayId,
  shizi_url,
  curRoute
}: HandleWechatBrowserPayParams) {
  // 招行支付
  if (payWay === WX_PAY_WAYS.WECHAT_CMB) {
    const { content } = payConfigData;
    window.location.href = content;
    return;
  }

  // 中行支付
  if (payWay === WX_PAY_WAYS.WECHAT_BOC) {
    const { content } = payConfigData;
    const payParams = content && JSON.parse(content);

    WxPayCore({
      config: payParams,
      callback: (res) => {
        if (res !== 'ok') {
          JOJO.toast.show({ content: '支付失败!', duration: 2000, icon: 'fail' });
          return;
        }

        JOJO.toast.show({ content: '支付成功', duration: 2000, icon: 'success' });

        // 先学后付二次支付，无需跳转 /order/pending
        // if (curRoute === '/order/payForLearningFirst') {
        //   return;
        // }

        // const url = `/order/pending?${qs.stringify({
        //   orderId,
        //   orderPayId,
        //   isEntity: true,
        //   shizi_url
        // })}`;

        // JOJO.navigate(url, { mode: 'replace' });
      }
    });
    return;
  }
  // 微信原生支付
  handleNativeWxPay({
    payConfigData,
    orderId,
    orderPayId,
    shizi_url,
    curRoute
    // isNativeWx: !!isNativeWx
  });
}

/**
 * 处理原生微信支付
 */
function handleNativeWxPay({
  payConfigData,
  orderId,
  orderPayId,
  shizi_url,
  curRoute,
  isNativeWx
}: HandleNativeWxPayParams) {
  WxPayCore({
    config: payConfigData,
    callback: (res) => {
      if (res !== 'ok') {
        JOJO.toast.show({ content: '支付失败!', duration: 2000, icon: 'fail' });
        return;
      }

      JOJO.toast.show({ content: '支付成功', duration: 2000, icon: 'success' });

      // if (isNativeWx) {
      //   const href = window.location.href.replace('preFetch=true', '');
      //   window.location.href = href;
      // } else {
      //   // 先学后付二次支付，无需跳转 /order/pending
      //   if (curRoute === '/order/payForLearningFirst') {
      //     return;
      //   }

      //   const url = `/order/pending?${qs.stringify({
      //     orderId,
      //     orderPayId,
      //     isEntity: true,
      //     shizi_url
      //   })}`;

      //   JOJO.navigate(`${FROUNT_URL_OLD}${url}`, { mode: 'replace' });
      // }
    }
  });
}

interface BuildPaymentParamsParams {
  payWay: number;
  orderId: string;
  orderPayId: number;
  curRoute: string;
}

/**
 * 构建支付参数
 */
function buildPaymentParams({ payWay, orderId, orderPayId, curRoute }: BuildPaymentParamsParams) {
  return {
    backUrl:
      payWay === WX_PAY_WAYS.WECHAT_BOC
        ? `${FROUNT_URL_OLD}/order/wxTicket?${qs.stringify({
            orderId,
            orderPayId
          })}`
        : `${FROUNT_URL}${curRoute}?${qs.stringify({
            ...JOJO.Utils.getQuery(),
            isAlreadyCreateOrder: '1'
          })}`,
    wechatAppId: JOJO.Os.xcx ? navigator.userAgent.match(/wx[0-9a-z]+$/)![0] : '',
    payBillId: orderPayId,
    payEnv: '', // 占位符，将在调用时填充
    payWay
  };
}

// interface WxPayMainParams extends WxPayProps {}

/**
 * 微信支付主函数
 * @param props 支付参数
 */
export async function wxPay(props: WxPayProps) {
  const {
    payWay,
    orderPayId,
    orderId,
    curRoute = '/order/create',
    totalAmount,
    shizi_url,
    isNativeWx
  } = props;

  console.log('微信支付', props);

  const payEnv = await getEnvEnum();

  // 统一获取支付信息
  const params: ParamsType = buildPaymentParams({ payWay, orderId, orderPayId, curRoute });
  params.payEnv = payEnv;

  try {
    const payConfigRes = await billCheckOut(params);
    const { data, resultCode, errorMsg } = payConfigRes;
    const { data: payConfigData } = data || {};

    if (resultCode !== 200 || !payConfigData) {
      JOJO.toast.show({ content: errorMsg || '系统开小差啦', duration: 2000, icon: 'fail' });
      return;
    }

    // 小程序：原生
    if (JOJO.Os.xcx) {
      handleMiniProgramPay({ payConfigData, orderId, curRoute });
      return;
    }

    // app：原生、微信扫码
    if (JOJO.Os.app) {
      await handleAppPay({
        payConfigData,
        orderId,
        orderPayId,
        totalAmount,
        shizi_url,
        payWay
      });
      return;
    }

    // 微信浏览器：招行、中行、原生
    if (JOJO.Os.wechatBrowser) {
      handleWechatBrowserPay({
        payWay,
        payConfigData,
        orderId,
        orderPayId,
        shizi_url,
        curRoute
      });
      return;
    }

    // 其他环境：原生
    handleNativeWxPay({
      payConfigData,
      orderId,
      orderPayId,
      shizi_url,
      curRoute,
      isNativeWx: !!isNativeWx
    });
  } catch (error) {
    console.error('微信支付失败:', error);
    JOJO.toast.show({ content: '支付失败，请稍后重试', duration: 2000, icon: 'fail' });
  }
}
