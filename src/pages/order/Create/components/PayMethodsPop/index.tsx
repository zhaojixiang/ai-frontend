import cx from 'classnames';
import qs from 'query-string';
import React from 'react';

import { FROUNT_URL_OLD } from '@/services/config';

// import { sensElementView } from '@/utils/sensors';
import S from './index.module.less';

interface IProps {
  detail: any;
  payWays: any;
  price: number;
  subscriptionType?: string;
  onHandlePayWay: (code: number) => void;
  onHandleSubscribeWay: () => void;
  onClose?: () => void;
  renderAgreement?: () => React.ReactNode;
}

export default (props: IProps) => {
  const {
    detail,
    payWays,
    price,
    subscriptionType,
    onHandlePayWay,
    onHandleSubscribeWay,
    onClose,
    renderAgreement
  } = props;

  const { currencyType } = detail || {};

  /**
   * 关闭弹窗
   */
  const handleClose = () => {
    if (onClose) {
      onClose?.();
    } else {
      if (!subscriptionType) {
        JOJO.navigate(`${FROUNT_URL_OLD}/order/list?tab=1`, { to: 'externalWeb' });
      } else {
        const { isAlreadyCreateOrder, totalAmount, ...rest } = JOJO.Utils.getQuery() || {};
        JOJO.navigate(`/order/create?${qs.stringify(rest)}`, { mode: 'replace' });
      }
    }
  };

  // 渲染单个支付方式项
  const renderPayWayItem = (item: any) => {
    let iconClass = '';
    let label = '';

    if (item?.platform === 'WxPay') {
      // 微信支付
      iconClass = S.wxpayIcon;
      label = '微信支付';
    } else {
      // 判断支付方式类型
      if ([110, 140]?.includes(item?.code)) {
        // 支付宝支付
        iconClass = S.alipayIcon;
        label = '支付宝';
      } else if ([111, 142]?.includes(item?.code)) {
        // 支付宝当面付 | 中行支付宝扫码付
        iconClass = S.aliscanIcon;
        label = '支付宝扫码付';
      } else if ([160]?.includes(item?.code)) {
        // 苹果支付
        iconClass = S.appleIcon;
        label = item?.name;
      } else if ([180]?.includes(item?.code)) {
        // 谷歌支付
        iconClass = S.googleIcon;
        label = item?.name;
      } else {
        return null; // 不支持的支付方式
      }
    }

    return (
      <div
        className={cx(S.itemBox)}
        key={item?.code}
        onClick={() => {
          if (subscriptionType) {
            onHandleSubscribeWay?.();
          } else {
            onHandlePayWay?.(item?.code);
          }
        }}>
        <div className={cx(S.labelIcon, iconClass)} />
        {label}
      </div>
    );
  };

  return (
    <div className={S.payMethodsWrap}>
      <div className={S.content}>
        <div className='close' onClick={handleClose} />
        <div className={S.title}>支付金额</div>
        <div className={S.amount}>
          {currencyType === 'USD' ? 'USD $' : '￥'}
          {price || '0.00'}
        </div>
        <div
          className={S.itemWrap}
          style={{ justifyContent: payWays?.length > 1 ? 'space-between' : 'center' }}>
          {subscriptionType ? (
            renderPayWayItem({ code: 'subscribe', platform: 'AliPay' })
          ) : (
            <>{payWays?.map((item: any) => renderPayWayItem(item))}</>
          )}
        </div>
        <div className={S.agreement}>{renderAgreement?.()}</div>
      </div>
    </div>
  );
};
