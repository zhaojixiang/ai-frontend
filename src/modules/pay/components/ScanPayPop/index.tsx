import { Button } from 'antd-mobile';
import classnames from 'classnames';
import QRCode from 'qrcode';
import { useCallback, useEffect, useRef, useState } from 'react';

// import refreshIcon from '@/public/assets/images/refresh.png';
// import { billCheckOutByToken } from '@/services/api/orderPay';
import S from './index.module.less';

interface IProps {
  url: string;
  totalAmount: string;
  payWay: number;
  onClose: () => void;
}

/**
 * 页面组件
 * @param query
 * @returns {*}
 * @constructor
 */
function Pay({ url, totalAmount, payWay, onClose }: IProps) {
  const containerRef = useRef<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  // const [refreshLoading, setRefreshLoading] = useState(false);

  useEffect(() => {
    initQrcode(url);
  }, []);

  /**
   * 初始化二维码
   * @param signUrl 签名后的url
   */
  const initQrcode = (signUrl: string) => {
    const newUrl = window.atob(signUrl);
    QRCode.toDataURL(newUrl, { margin: 0 })
      .then((dataUrl) => {
        setQrCodeUrl(dataUrl);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  /**
   * 开始截图
   * @returns {Promise<void>}
   */
  const saveQR = useCallback(async () => {
    if (JOJO.bridge.canUseBridge()) {
      const dataUrl = await JOJO.Utils.capture(containerRef.current);
      const res = await JOJO.Utils.urlToBase64(dataUrl);
      try {
        await JOJO.bridge.saveBase64Image({ base64: res });
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  /**
   * 刷新二维码
   */
  // const refreshQrCode = async () => {
  //   setRefreshLoading(true);
  //   const res = await billCheckOutByToken(token);
  //   const data = res.data && res.data.data;
  //   if (data) {
  //     initQrcode(data);
  //   }
  //   setRefreshLoading(false);
  // };

  /**
   * 渲染支付方式图标
   * @param method 支付方式
   * @returns 图标
   */
  const renderMethodIcon = (method: number) =>
    classnames(
      S.icon,
      method === 100 ? S.iconWxpay : '',
      [110, 111, 140].includes(method) ? S.iconAliPay : '',
      method === 112 ? S.iconAliPayByStages : ''
    );
  const payWayName = payWay === 100 ? '微信' : '支付宝';
  return (
    <div className={S.container}>
      <div className={S.contentDetail} ref={containerRef}>
        <p className={classnames(S.detailTitle, payWay === 100 ? S.wechatTitle : S.alipayTitle)}>
          <span className={renderMethodIcon(payWay)}>&nbsp;</span>
          <span>
            {payWayName}
            扫码支付
          </span>
        </p>
        <p className={S.detailPrice}>¥{totalAmount || '0.00'}</p>
        <p>
          <img src={qrCodeUrl} alt='' />
          {/* {refreshLoading && (
            <div className={S.loadingMask}>
              <img src={refreshIcon} className={S.refreshIcon} />
            </div>
          )} */}
        </p>
        {/* {`${payWay}` === '140' ? (
          <div className={S.refreshText} onClick={refreshQrCode}>
            二维码失效？点击刷新二维码
          </div>
        ) : null} */}
      </div>
      <Button
        className={classnames(S.btn, S.confirmBtn, payWay === 100 ? S.wechatBtn : S.alipayBtn)}
        onClick={saveQR}>
        保存二维码
      </Button>
      <Button className={classnames(S.btn, S.cancelBtn)} onClick={onClose}>
        取消支付
      </Button>
      <span className={S.tips}>
        检测到您未安装
        {payWayName}
        ,请安装
        {payWayName}
        后扫码支付
      </span>
    </div>
  );
}

export default Pay;
