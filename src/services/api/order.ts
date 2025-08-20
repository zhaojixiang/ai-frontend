import Cookies from 'js-cookie';

import { serviceUrl } from '@/services/config';

/**
 * 获取物流轨迹
 */
export const getDeliveryTrace = (params: { gpoNo: string; expressNo: string }) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.order,
    url: `/deliveryPage/queryTrace`
  });
};
/**
 * 获取订单详情
 */
export const getOrderDetail = (params: {
  orderId: string;
  skuId: string;
  expressNumber: string;
}) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.order,
    url: `/deliveryPage/queryOrderDetail`
  });
};
/**
 * 校验订单
 */
export const validateOrder = (params: {
  linkCode: string;
  skuId?: string;
  giftPools?: string;
  totalAmount: number;
  skuPrice: number;
  subscriptionType: number;
}) => {
  const uid = Cookies.get('uid') || 1;
  return JOJO.request(
    { ...params, userId: uid, quantity: 1 },
    {
      baseURL: serviceUrl.order,
      url: `/place-order/validateV2`,
      method: 'POST'
    }
  );
};
/**
 * 校验订单
 */
export const precheckOrder = (params: {
  payAmount?: string;
  skuId?: string;
  payMode?: string;
  orderSourceCode?: number;
  action: 'CHEAP' | 'LEARNING_PAY';
}) => {
  return JOJO.request(params, {
    baseURL: serviceUrl.order,
    url: `/user/orders/precheck`,
    method: 'POST'
  });
};
