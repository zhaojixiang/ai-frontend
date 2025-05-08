export const envName = process.env.ENV_NAME; // 环境变量
// 是否调试模式，区别非正式环境
export const DEBUG = !!envName && envName !== 'pro';
const env = DEBUG ? `.${envName}` : '';

/**
 * uc授权地址
 */
export const AUTH_SIGN_URL =
	process.env.AUTH_SIGN_URL || 'https://uc-api.tinman.cn/page/wechatMp/portal/entrance';

/**
 * 商城服务基础域名
 */
const MALL_SERVICE_URL_BASE =
	process.env.MALL_SERVICE_URL_BASE || JOJO.os.matrix
		? `https://api-${envName}.cdssylkj.com/mall`
		: `https://api${env}.tinman.cn/mall`;

// export const

/**
 * 商城服务域名
 */
export const serviceUrl = {
	MALL_BASE_URL: process.env.MALL_BASE_URL || `${MALL_SERVICE_URL_BASE}/product/api/fe`
};

export default {
	AUTH_SIGN_URL,
	serviceUrl
};
