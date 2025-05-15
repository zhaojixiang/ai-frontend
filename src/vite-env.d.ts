/// <reference types="vite/client" />

import { OS } from './lib/os/index';
import { AxiosRequestConfig } from 'axios';
import { ShowPageConfig } from './lib/showPage';

declare global {
  interface Window {
    JOJO: {
      os: OS;
    };
    sensors: any;
    sensorsExpoSure: any;
  }

  const JOJO: {
    os: OS;
    Utils: any;
    request: <T = any>(
      dataOrParams: object, // 第一个参数：接口所需的参数
      config: AxiosRequestConfig = {} // 第二个参数：其他配置
    ) => Promise<T>;
    showPage: (url: string, { to, mode = 'navigate', params = {} }?: ShowPageConfig) => void;
  };
}

declare module 'postcss-px-to-viewport';
