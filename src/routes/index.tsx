import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import About from '../pages/About';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				index: true,
				element: <Navigate to='/item/detail' replace />
			},
			{
				path: 'home',
				element: <Home />
			}
			// 可以添加更多子路由
		]
	},
	{
		path: '/item/detail',
		element: <About />
	}
]);

export default router;
