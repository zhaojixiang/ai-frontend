export interface CaptureOptions {
  ignoreElements?: (element: HTMLElement) => boolean;
  scale?: number; // 缩放倍数，影响清晰度
  format?: 'image/png' | 'image/jpeg' | 'image/webp';
  quality?: number; // 仅对 jpeg/webp 有效
}

export interface UrlToBase64Options {
  outputFormat?: 'image/png' | 'image/jpeg' | 'image/webp';
  quality?: number;
}

export interface Utils {
  // 获取查询参数
  getQuery: (search?: string) => Record<string, string>;

  // 设置favicon
  setupFavicon: () => void;
  // 过滤掉对象中值为空字符串或 undefined 的属性
  filterEmptyParams: <T extends Record<string, any>>(params: T) => Partial<T>;

  // 将图片URL转换为Base64
  urlToBase64: (url: string, options?: UrlToBase64Options) => Promise<string>;
  // 截取HTML元素
  capture: (node: HTMLElement, options?: CaptureOptions) => Promise<string>;
}
