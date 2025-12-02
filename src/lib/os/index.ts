import { type OS } from './index.d';

const { userAgent } = window.navigator;

const Os: OS = {
  /**
   * 本地调试
   */
  get debug() {
    return import.meta.env.DEV;
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
  get wechatBrowser() {
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

export default Os;
