import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(() => {
	// 注入外部变量
	const envKeys = ['APP_NAME'];
	// 为没有前缀的变量添加 VITE_ 前缀
	Object.keys(process.env).forEach((item) => {
		if (envKeys.includes(item)) {
			process.env[`VITE_${item}`] = process.env[item];
		}
	});

	return {
		plugins: [react()]
	};
});
