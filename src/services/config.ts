import Os from '@/lib/os';

// 环境前缀分隔符
let separator = '';
if (import.meta.env.VITE_ENV_NAME !== 'pro') {
  separator = Os.jojo ? '.' : '-';
}
// 环境前缀
const env = import.meta.env.VITE_ENV_NAME === 'pro' ? '' : import.meta.env.VITE_ENV_NAME;
// 分隔符 + 环境前缀
const separatorEnv = separator + env;

// ---------商城前端域名-----------

// 商城前端基础域名
export const JOJO_FROUNT_URL_BASE = `https://mall${separatorEnv}.tinman.cn`;
export const JOJOUP_FROUNT_URL_BASE = `https://pages${separatorEnv}.mohezi.cn`;
export const MATRIX_FROUNT_URL_BASE = `https://mall${separatorEnv}.cdssylkj.com`;

// 商城前端域名 新版
export const JOJO_FROUNT_URL = `https://mall${separatorEnv}.tinman.cn/velocity`;
export const JOJOUP_FROUNT_URL = `https://pages${separatorEnv}.mohezi.cn/mall/velocity`;
export const MATRIX_FROUNT_URL = `https://mall${separatorEnv}.cdssylkj.com/velocity`;

// 商城前端域名 旧版
export const JOJO_FROUNT_URL_OLD = JOJO_FROUNT_URL_BASE;
export const JOJOUP_FROUNT_URL_OLD = `https://pages${separatorEnv}.mohezi.cn/mall/center`;
export const MATRIX_FROUNT_URL_OLD = MATRIX_FROUNT_URL_BASE;
let frontUrlOld: string;
if (Os.jojo) {
  frontUrlOld = JOJO_FROUNT_URL_OLD;
} else if (Os.jojoup) {
  frontUrlOld = JOJOUP_FROUNT_URL_OLD;
} else {
  frontUrlOld = MATRIX_FROUNT_URL_OLD;
}
export const FROUNT_URL_OLD = frontUrlOld;

// ---------外部前端域名----------
export const MARKETING_BASE_URL = Os.jojoup
  ? `${window.location.origin}/mall/market`
  : `https://act${separatorEnv}.tinman.cn`;

// 智齿客服地址
export const JING_TAN_NO_AUTH_URL = Os.jojoup
  ? `https://api.mohezi.cn/fb/pagani/api/pagani/view/jingtan/chat`
  : `https://api${separatorEnv}.tinman.cn/api/pagani/view/jingtan/chat`;

// 解绑子账号地址
export const UNBIND_URL = Os.jojoup
  ? `https://pages${separatorEnv}.mohezi.cn/read/server-v2/page/userSubAccount/view/bind`
  : `https://jojoread${separatorEnv}.tinman.cn/page/userSubAccount/view/bind`;

// UC授权地址
export const UC_API_URL_BASE = `https://uc-api.${separatorEnv}.tinman.cn`;

// ---------服务端域名-----------
// 服务端域名前缀
let serviceUrlPrefix: string;
if (Os.jojo) {
  serviceUrlPrefix = `https://api${separatorEnv}.tinman.cn/mall`;
} else if (Os.jojoup) {
  serviceUrlPrefix = `https://pages${separatorEnv}.mohezi.cn/mall/center`;
} else {
  serviceUrlPrefix = `https://api${separatorEnv}.cdssylkj.com/mall`;
}
/**
 * 服务端域名
 */
export const serviceUrl = {
  product: `${serviceUrlPrefix}/product/api/fe`,
  coupon: `${serviceUrlPrefix}/coupon/api/coupon/fe`,
  order: `${serviceUrlPrefix}/order/api/fe`
};

export const AUTH_SIGN_URL = `${UC_API_URL_BASE}/page/wechatMp/portal/entrance`;

export default {
  serviceUrl,
  AUTH_SIGN_URL
};
