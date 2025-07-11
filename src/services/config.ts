import Os from '@/lib/os';

// 环境前缀分隔符
const separator = import.meta.env.VITE_ENV_NAME === 'pro' ? '' : Os.jojo ? '.' : '-';
// 环境前缀
const env = import.meta.env.VITE_ENV_NAME === 'pro' ? '' : import.meta.env.VITE_ENV_NAME;

/**
 * 服务端域名
 */
export const serviceUrl = {
  product: `https://api${separator}${env}.tinman.cn/mall/product/api/fe`,
  coupon: `https://api${separator}${env}.tinman.cn/mall/coupon/api/coupon/fe`
};
export const AUTH_SIGN_URL = 'https://uc-api.tinman.cn/page/wechatMp/portal/entrance';

export default {
  serviceUrl,
  AUTH_SIGN_URL
};
