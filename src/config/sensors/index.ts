import sensors from '@woulsl-tools/sensors';
import Exposure from './exposure';

const ua = window.navigator.userAgent;
let platform = '其他';
const isWx = /MicroMessenger/i.test(ua);
const isMiniApp = /miniprogram/i.test(ua);

const envName = process.env.ENV_NAME;

if (isWx && isMiniApp) {
	platform = '微信小程序';
} else if (isWx) {
	platform = '微信内';
} else if (/JoJoVersion/i.test(ua)) {
	platform = 'APP内';
}

let server_url = '';
if (envName === 'pro') {
	if (JOJO.os.jojoup) {
		server_url = 'https://sensors.tinman.cn/sa?project=jojoup';
	} else if (JOJO.os.matrix) {
		server_url = 'https://sensors.tinman.cn/sa?project=jojo_matrix';
	} else {
		server_url = 'https://sensors.tinman.cn/sa?project=production';
	}
} else {
	server_url = 'https://sensors.tinman.cn/sa?project=default';
}

window.sensorsExpoSure = sensors.use(Exposure, {
	area_rate: 0,
	stay_duration: 0,
	repeated: true
});

// 注册sensors
sensors.tinmanSensorsInit({
	lob: 'mall',
	env_name: envName || '',
	// show_log: "<%= context.ENV_DEBUG %>",
	show_log: false,
	server_url, // 可手动配置神策服务地址，需区分环境
	autoTrackSet() {
		sensors.quick('isReady', function () {
			// 注册公共属性
			const registerParams = {
				custom_platform: platform
			};

			sensors.registerPage(registerParams);
		});
		// 配置自动上报
		// const isAutoTrackPath = [].indexOf(window.location.pathname) > -1;
		// if (isAutoTrackPath) {
		// 	return false;
		// }
		return true;
	}
});

window.sensors = sensors;
