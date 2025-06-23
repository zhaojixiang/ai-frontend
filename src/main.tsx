import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import request from '@/lib/request';

import * as utils from './lib/utils';
import './index.less';
import { initDebugger } from './lib/debugger';
import './lib/i18n';
import os from './lib/os';
import { initSensors } from './lib/sensors';
import { initSentry } from './lib/sentry';
import { showPage } from './lib/showPage';
import router from './routes';

// 注册全局变量 JOJO
window.JOJO = window.JOJO || {};
Object.freeze(Object.assign(window.JOJO, { os, utils, request, showPage }));

// 初始化Sentry: 在 JOJO 全局变量定义之后初始化sentry
initSentry();

// 初始化神策
initSensors();

// 初始化调试工具
initDebugger();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
