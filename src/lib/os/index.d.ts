export interface OS {
  /**
   * 本地调试
   */
  debug: boolean;

  /**
   * 是小程序
   */
  xcx: boolean;
  /**
   * 是微信环境（包含：小程序、微信浏览器）
   */
  wechat: boolean;
  /**
   * 是微信浏览器
   */
  wechatBrowser: boolean;
  /**
   * 是支付宝
   */
  ali: boolean;
  /**
   * 是钉钉
   */
  dingding: boolean;
}
