let os = {};
const userAgent = window.navigator.userAgent;
const weChatInfo = userAgent.match(/MicroMessenger\/([\d.]+)/i);
const app = /JoJo(Version|WebViewVersion)/i.test(window.navigator.userAgent);

let isBreakingWechatVersion = false;
let wechatVersion = 0;

if (weChatInfo && weChatInfo.length > 0) {
	wechatVersion = weChatInfo[1].replace(/\./g, '');

	if (wechatVersion >= 667) {
		isBreakingWechatVersion = true;
	}
}

// 是不是pc，包含了pc chrome上的手机模拟器
const PC = !!navigator.platform.match(/mac|win/i) && !navigator.userAgent.match(/ipad/i);

os = {
	// 是APP（包含：叫叫识字、叫叫绘本、叫叫口算、叫叫儿童阅读、jojoup）
	get app() {
		return app;
	},
	// 是jojoupAPP
	get jojoupApp() {
		return app && !!/flawless/i.test(userAgent);
	},
	// 是叫叫儿童阅读APP
	get jojoReadApp() {
		return app && !!/JoJoAppFrom\/read/i.test(userAgent);
	},
	// 是叫叫儿童阅读APP 鸿蒙版
	get jojoReadHmApp() {
		return app && !!/JoJoAppFrom\/read\/hm/i.test(userAgent);
	},
	// 是识字APP
	get shiziAPP() {
		return app && !!/JoJoSherlock/gim.test(userAgent);
	},
	// 是绘本APP
	get huibenAPP() {
		return app && !!/huiben/gim.test(userAgent);
	},
	// 是口算APP
	get kousuanAPP() {
		return app && !!/JoJoCalculator/gim.test(userAgent);
	},
	// 是小程序
	get xcx() {
		return !!/miniprogram/gim.test(userAgent);
	},
	// 是微信环境（包含：小程序、微信浏览器）
	get wechat() {
		return !!/MicroMessenger/i.test(userAgent);
	},
	// 是微信浏览器
	get wechatGzh() {
		return !!/MicroMessenger/i.test(userAgent) && !/miniprogram/gim.test(userAgent);
	},
	// 是支付宝
	get ali() {
		return !!/AlipayClient/i.test(userAgent);
	},
	// 是钉钉
	get dingding() {
		return !!/DingTalk/i.test(userAgent);
	}
};

export default os;
