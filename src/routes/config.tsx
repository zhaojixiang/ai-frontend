import { lazy } from 'react';

// 懒加载页面
const App = lazy(() => import('@/App'));
const Home = lazy(() => import('@/pages/Home'));
const ChatApi = lazy(() => import('@/pages/ChatApi'));
const Editor = lazy(() => import('@/pages/Editor'));

const NotFound = lazy(() => import('@/pages/NotFount'));
export const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      { path: 'home', element: <Home /> },
      { path: 'chat-api', element: <ChatApi /> },
      { path: 'editor', element: <Editor /> },
      { path: '*', element: <NotFound /> }
    ]
  }
];
