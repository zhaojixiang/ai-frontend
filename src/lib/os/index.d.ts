export interface OS {
	/**
	 * 版本
	 */
	version: number;
	/**
	 * 当前 H5环境 是叫叫
	 */
	jojo: boolean;
	/**
	 * 当前 H5环境 是jojoup
	 */
	jojoup: boolean;
	/**
	 * 当前 H5环境 是矩阵
	 */
	matrix: boolean;
	/**
	 * 是APP
	 */
	app: boolean;
	/**
	 * 是jojoupApp
	 */
	jojoupApp: boolean;
	/**
	 * 是叫叫儿童阅读APP
	 */
	jojoReadApp: boolean;
	/**
	 * 是识字APP
	 */
	shiziAPP: boolean;
	/**
	 * 是口算APP
	 */
	kousuanAPP: boolean;
	/**
	 * 是绘本APP
	 */
	huibenAPP: boolean;
	/**
	 * 是微信环境
	 */
	wechat: boolean;
	/**
	 * 移动端微信
	 */
	wechatPhone: boolean;
	/**
	 * 桌面版微信
	 */
	wechatPC: boolean;
	/**
	 * 企业微信
	 */
	wxwork: boolean;
	/**
	 * 微信版本
	 */
	wechatVersion: number;
	/**
	 * 是小程序
	 */
	xcx: boolean;
	/**
	 * 是叫叫儿童阅读小程序
	 */
	jojoXcx: boolean;
	/**
	 * 是叫叫家长端小程序
	 */
	jojoForPatriarchXcx: boolean;
	/**
	 * 是jojoUp小程序
	 */
	jojoUpXcx: string;
	/**
	 * 是安卓
	 */
	android: boolean;
	/**
	 * 安卓系统版本
	 */
	androidVersion: number;
	/**
	 * 是iOS
	 */
	ios: boolean;
	/**
	 * iOS系统版本
	 */
	iosVersion: number;
	/**
	 * iOS系统原始版本
	 */
	iosVersionRaw: number;
}

const os: OS;

export default os;
