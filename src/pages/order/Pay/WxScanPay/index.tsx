import React, { useEffect } from 'react';

import { wxPay } from '@/modules/pay';
import type { WxPayProps } from '@/modules/pay/wxPay';

interface IProps extends WxPayProps {
  payWay: number;
  shizi_url: any;
  orderId: string;
  orderPayId: number;
  totalAmount: string;
}

export default function WxScanPay(props: IProps) {
  const { payWay, shizi_url, orderId, orderPayId, totalAmount } = props;
  useEffect(() => {
    wxPay({ payWay, shizi_url, orderId, orderPayId, totalAmount });
  }, []);
  return <div>1</div>;
}
