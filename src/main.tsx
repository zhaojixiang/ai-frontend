import './index.less';
import './lib/i18n';

import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { initJJ } from '@/lib/initJJ';
import { setupFavicon } from '@/lib/utils';

import { initDebugger } from './lib/debugger';
import router from './routes';

// 注册全局变量 JJ
initJJ().then(() => {
  // 初始化调试工具
  initDebugger();
  // 设置favicon
  setupFavicon();

  // 设置高德地图
  // 强制使用webGL
  window.forceWebGL = true;
  // 设置高德安全密钥
  window._AMapSecurityConfig = {
    serviceHost: window.location.origin + '/_AMapService'
  };

  createRoot(document.getElementById('root')!).render(<RouterProvider router={router} />);
});
