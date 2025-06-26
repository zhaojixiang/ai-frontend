/// <reference types="vite/client" />
import { type AxiosRequestConfig } from 'axios';

import { type OS } from './lib/os/index';
import { type ShowPageConfig } from './lib/showPage';

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
    request: <T = any>(params: any, config?: AxiosRequestConfig) => Promise<T>;
    showPage: (url: string, { to, mode = 'navigate', params = {} }?: ShowPageConfig) => void;
  };
}

declare module 'postcss-px-to-viewport';
