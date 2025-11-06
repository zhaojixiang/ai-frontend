import type { CreateOrderParams } from '@/services/api/order';

export interface ScanPayDataProps {
  url: string;
  totalAmount: string;
  payWay: string;
  token: string;
}
export interface CreateOrderProps extends CreateOrderParams {
  payWay: number;
  subscriptionType: string;
  onShowValidatePricePop: (val: any) => void;
  onShowActivityChangePop: (val: any) => void;
}
export interface PayParams {
  orderId: string;
  totalAmount: number;
  payWay: number;
  orderPayId: string;
  orderSource: string;
  externalProductCode: string;
  showPayModel: boolean;
  cancelRequesting: () => void;
  continueRequesting: () => void;
}
