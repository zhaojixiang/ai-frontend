import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.less';
import router from './routes';
import { RouterProvider } from 'react-router-dom';
import os from './lib/os';
import * as utils from './lib/utils';
import request from '@/lib/request';
import { initSentry } from './config/sentry';
import { initSensors } from './config/sensors';
import { showPage } from './lib/showPage';

import 'antd-mobile/es/global';

// 注册全局变量 JOJO
window.JOJO = window.JOJO || {};
Object.freeze(Object.assign(window.JOJO, { os, utils, request, showPage }));

// 初始化Sentry: 在 JOJO 全局变量定义之后初始化sentry
initSentry();

// 初始化神策
initSensors();

// 调试工具
if (import.meta.env.MODE === 'development') {
  import('eruda').then((eruda) => eruda.default.init());
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
