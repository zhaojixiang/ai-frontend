/// <reference types="vite/client" />
import { type ToastShowProps } from 'antd-mobile';
import { type AxiosRequestConfig } from 'axios';

import { type NavigatorConfig } from './lib/navigate';
import { type OS } from './lib/os/index.d';
import { type Utils } from './lib/utils/index.d';

// 扩展 Axios 类型
declare module 'axios' {
  export interface InternalAxiosRequestConfig extends AxiosRequestConfig {
    handleResultCode?: boolean;
  }
}

declare global {
  type ToastType = {
    show: (options: ToastShowProps) => void;
    close: () => void;
  };
  type LoadingType = {
    show: (options?: ToastShowProps) => void;
    close: () => void;
  };
  type PopupType = {
    (content: React.ReactNode, options?: FullScreenPopupOptions): { destroy: () => void };
    confirm: (options: PopupConfirmOptions) => { destroy: () => void };
  };
  interface JOJOTYPE {
    Os: OS;
    loading: LoadingType;
    Utils: Utils;
    request: <T = any>(params: any, config?: AxiosRequestConfig) => Promise<T>;
    navigate: (url: string, { to, mode = 'navigate', params = {} }?: NavigatorConfig) => void;
    toast: ToastType;
    bridge: any;
    popup: PopupType;
  }
  /**
   * jojo
   */
  const JOJO: JOJOTYPE;
  interface Window {
    JOJO: JOJOTYPE;
    sensors: any;
    sensorsExpoSure: any;
    forceWebGL: boolean;
    _AMapSecurityConfig: any;
  }
}

declare module 'postcss-px-to-viewport';

declare module '@woulsl/storage' {
  interface StorageAPI {
    get: (key: string) => any;
    set: (key: string, value: any) => void;
    remove: (key: string) => void;
    clear: () => void;
  }

  const storage: StorageAPI;
  export default storage;
}

declare module '@woulsl/storage/session' {
  interface SessionStorageAPI {
    get: (key: string) => any;
    set: (key: string, value: any) => void;
    remove: (key: string) => void;
    clear: () => void;
  }

  const session: SessionStorageAPI;
  export default session;
}
