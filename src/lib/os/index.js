let os = {};
const userAgent = window.navigator.userAgent;
const app = /JoJo(Version|WebViewVersion)/i.test(window.navigator.userAgent);

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
  /**
   * 当前 H5环境 是叫叫
   */
  get jojo() {
    return import.meta.env.VITE_APP_NAME === '';
  },
  /**
   * 当前 H5环境 是jojoup
   */
  get jojoup() {
    return import.meta.env.VITE_APP_NAME === 'jojoup';
  },
  /**
   * 当前 H5环境 是矩阵
   */
  get matrix() {
    return import.meta.env.VITE_APP_NAME === 'matrix';
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
