/// <reference types="vite/client" />

import { OS } from './lib/os/index';

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
  };
}

declare module 'postcss-px-to-viewport';
