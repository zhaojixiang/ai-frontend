import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.less';
import router from './routes';
import { RouterProvider } from 'react-router-dom';
import os from './lib/os';
import * as utils from './lib/utils';
import './config/sentry';

import 'antd-mobile/es/global';

// 注册全局变量 JOJO
window.JOJO = window.JOJO || {};
Object.assign(window.JOJO, { os, utils });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
