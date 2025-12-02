import { lazy } from 'react';

// 懒加载页面
const App = lazy(() => import('@/App'));
const Home = lazy(() => import('@/pages/Home'));

const NotFound = lazy(() => import('@/pages/NotFount'));
export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: 'home', element: <Home /> },
      { path: '*', element: <NotFound /> }
    ]
  }
];
