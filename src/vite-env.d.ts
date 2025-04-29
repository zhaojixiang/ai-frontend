/// <reference types="vite/client" />

import { OS } from '../packages/lib-os/index.d.ts';

declare global {
	interface Window {
		JOJO: {
			os: OS;
		};
	}

	const JOJO: {
		os: OS;
		Utils: any;
	};
}

declare module '*.less' {
	const classes: { [key: string]: string };
	export default classes;
}
