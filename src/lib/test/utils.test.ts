// import * as utils from '../utils';

// // 模拟 DOM 环境
// const mockDocument = {
//   head: {
//     appendChild: jest.fn()
//   } as any,
//   createElement: jest.fn(),
//   querySelectorAll: jest.fn()
// } as any;

// const mockWindow = {
//   location: {
//     search: '?param1=value1&param2=value2'
//   }
// } as any;

// describe('utils', () => {
//   // 保存原始的全局对象
//   const originalDocument = global.document;
//   const originalWindow = global.window;
//   const originalJOJO = global.JOJO;

//   beforeEach(() => {
//     // 设置模拟对象
//     global.document = mockDocument;
//     global.window = mockWindow;

//     // 清除所有模拟调用记录
//     jest.clearAllMocks();
//   });

//   afterEach(() => {
//     // 恢复原始对象
//     global.document = originalDocument;
//     global.window = originalWindow;
//     global.JOJO = originalJOJO;
//   });

//   describe('setupFavicon', () => {
//     it('should set favicon for jojo app', () => {
//       // 模拟 DOM 玎境
//       const mockLink = { rel: '', type: '', href: '' };
//       mockDocument.createElement.mockReturnValue(mockLink);
//       mockDocument.querySelectorAll.mockReturnValue([]);
//       mockDocument.head.appendChild.mockClear();

//       utils.setupFavicon();

//       expect(mockDocument.querySelectorAll).toHaveBeenCalledWith("link[rel*='icon']");
//       expect(mockDocument.createElement).toHaveBeenCalledWith('link');
//       expect(mockLink.rel).toBe('icon');
//       expect(mockLink.type).toBe('image/x-icon');
//       expect(mockLink.href).toBe('/jojo_logo.png');
//       expect(mockDocument.head.appendChild).toHaveBeenCalledWith(mockLink);
//     });

//     it('should set favicon for jojoup app', () => {
//       // 修改全局变量
//       const originalAppName = global.JOJO.Os.appName;
//       global.JOJO.Os.appName = 'jojoup';

//       const mockLink = { rel: '', type: '', href: '' };
//       mockDocument.createElement.mockReturnValue(mockLink);
//       mockDocument.querySelectorAll.mockReturnValue([]);
//       mockDocument.head.appendChild.mockClear();

//       utils.setupFavicon();

//       expect(mockLink.href).toBe('/jojoup_logo.png');

//       // 恢复原始值
//       global.JOJO.Os.appName = originalAppName;
//     });

//     it('should set favicon for matrix app', () => {
//       const originalAppName = global.JOJO.Os.appName;
//       global.JOJO.Os.appName = 'matrix';

//       const mockLink = { rel: '', type: '', href: '' };
//       mockDocument.createElement.mockReturnValue(mockLink);
//       mockDocument.querySelectorAll.mockReturnValue([]);
//       mockDocument.head.appendChild.mockClear();

//       utils.setupFavicon();

//       expect(mockLink.href).toBe('/jojo_logo.png');
//       global.JOJO.Os.appName = originalAppName;
//     });
//   });

//   describe('getQuery', () => {
//     it('should parse query parameters correctly', () => {
//       // 模拟 query-string 模块
//       jest.mock('query-string', () => ({
//         parse: jest.fn().mockReturnValue({ param1: 'value1', param2: 'value2' })
//       }));

//       const result = utils.getQuery('?param1=value1&param2=value2');

//       expect(result).toEqual({ param1: 'value1', param2: 'value2' });
//     });

//     it('should handle query parameters without leading question mark', () => {
//       jest.mock('query-string', () => ({
//         parse: jest.fn().mockReturnValue({ param1: 'value1' })
//       }));

//       const result = utils.getQuery('param1=value1');

//       expect(result).toEqual({ param1: 'value1' });
//     });

//     it('should convert null and undefined values to empty strings', () => {
//       jest.mock('query-string', () => ({
//         parse: jest.fn().mockReturnValue({ param1: null, param2: undefined, param3: 'value3' })
//       }));

//       const result = utils.getQuery('?param1=null&param2=undefined&param3=value3');

//       expect(result).toEqual({ param1: '', param2: '', param3: 'value3' });
//     });
//   });

//   describe('filterEmptyParams', () => {
//     it('should filter out empty string values', () => {
//       const params = {
//         param1: 'value1',
//         param2: '',
//         param3: 'value3',
//         param4: undefined
//       };

//       const result = utils.filterEmptyParams(params as any);

//       expect(result).toEqual({ param1: 'value1', param3: 'value3' });
//     });

//     it('should return empty object when all values are empty', () => {
//       const params = {
//         param1: '',
//         param2: undefined,
//         param3: ''
//       };

//       const result = utils.filterEmptyParams(params as any);

//       expect(result).toEqual({});
//     });

//     it('should return all parameters when none are empty', () => {
//       const params = {
//         param1: 'value1',
//         param2: 'value2',
//         param3: 0, // 0 is not considered empty
//         param4: false // false is not considered empty
//       };

//       const result = utils.filterEmptyParams(params);

//       expect(result).toEqual(params);
//     });
//   });

//   describe('getAppName', () => {
//     it('should return bundle ID when in app and bridge is available', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.canUseBridge.mockReturnValue(true);
//       global.JOJO.bridge.appInfo.mockResolvedValue({
//         data: { bundleID: 'com.shusheng.hm.jojoread' }
//       });

//       const result = await utils.getAppName();

//       expect(result).toBe('com.shusheng.hm.jojoread');
//     });

//     it('should return empty string when not in app', async () => {
//       const originalApp = global.JOJO.Os.app;
//       global.JOJO.Os.app = false;

//       const result = await utils.getAppName();

//       expect(result).toBe('');
//       global.JOJO.Os.app = originalApp;
//     });

//     it('should return empty string when bridge is not available', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.canUseBridge.mockReturnValue(false);

//       const result = await utils.getAppName();

//       expect(result).toBe('');
//     });

//     it('should handle error when getting app info fails', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.canUseBridge.mockReturnValue(true);
//       global.JOJO.bridge.appInfo.mockRejectedValue(new Error('Failed to get app info'));

//       const result = await utils.getAppName();

//       expect(result).toBe('');
//     });
//   });

//   describe('isJoJoReadAppForHM', () => {
//     it('should return true for HarmonyOS JoJo Read app', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.canUseBridge.mockReturnValue(true);
//       global.JOJO.bridge.appInfo.mockResolvedValue({
//         data: { bundleID: 'com.shusheng.hm.jojoread' }
//       });

//       const result = await utils.isJoJoReadAppForHM();

//       expect(result).toBe(true);
//     });

//     it('should return false for other apps', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.canUseBridge.mockReturnValue(true);
//       global.JOJO.bridge.appInfo.mockResolvedValue({
//         data: { bundleID: 'com.other.app' }
//       });

//       const result = await utils.isJoJoReadAppForHM();

//       expect(result).toBe(false);
//     });
//   });

//   describe('isHigerVersion', () => {
//     it('should return true when version2 is higher than version1', () => {
//       const result = utils.isHigerVersion('1.0.0', '1.0.1');
//       expect(result).toBe(true);
//     });

//     it('should return false when version2 is lower than version1', () => {
//       const result = utils.isHigerVersion('1.0.1', '1.0.0');
//       expect(result).toBe(false);
//     });

//     it('should return true when version2 equals version1', () => {
//       const result = utils.isHigerVersion('1.0.0', '1.0.0');
//       expect(result).toBe(true);
//     });

//     it('should handle major version differences', () => {
//       const result = utils.isHigerVersion('1.9.9', '2.0.0');
//       expect(result).toBe(true);
//     });

//     it('should handle minor version differences', () => {
//       const result = utils.isHigerVersion('1.1.9', '1.2.0');
//       expect(result).toBe(true);
//     });

//     it('should return false when either version is not provided', () => {
//       expect(utils.isHigerVersion('', '1.0.0')).toBe(false);
//       expect(utils.isHigerVersion('1.0.0', '')).toBe(false);
//       expect(utils.isHigerVersion('', '')).toBe(false);
//     });
//   });

//   describe('getDeviceOS', () => {
//     it('should return iOS when device OS is iOS', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.call.mockResolvedValue({
//         data: { deviceOS: 'iOS' }
//       });

//       const result = await utils.getDeviceOS();

//       expect(result).toBe('iOS');
//     });

//     it('should return Android when device OS is Android', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.call.mockResolvedValue({
//         data: { deviceOS: 'Android' }
//       });

//       const result = await utils.getDeviceOS();

//       expect(result).toBe('Android');
//     });

//     it('should return empty string when not in app', async () => {
//       const originalApp = global.JOJO.Os.app;
//       global.JOJO.Os.app = false;

//       const result = await utils.getDeviceOS();

//       expect(result).toBe('');
//       global.JOJO.Os.app = originalApp;
//     });
//   });

//   describe('isIosApp', () => {
//     it('should return true for iOS app', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.call.mockResolvedValue({
//         data: { deviceOS: 'iOS' }
//       });

//       const result = await utils.isIosApp();

//       expect(result).toBe(true);
//     });

//     it('should return false for non-iOS app', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.call.mockResolvedValue({
//         data: { deviceOS: 'Android' }
//       });

//       const result = await utils.isIosApp();

//       expect(result).toBe(false);
//     });
//   });

//   describe('isAndroidApp', () => {
//     it('should return true for Android app', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.call.mockResolvedValue({
//         data: { deviceOS: 'Android' }
//       });

//       const result = await utils.isAndroidApp();

//       expect(result).toBe(true);
//     });

//     it('should return false for non-Android app', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.call.mockResolvedValue({
//         data: { deviceOS: 'iOS' }
//       });

//       const result = await utils.isAndroidApp();

//       expect(result).toBe(false);
//     });
//   });

//   describe('getAliExist', () => {
//     it('should return true when Alipay is installed', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.canUseBridge.mockReturnValue(true);
//       global.JOJO.bridge.isAppInstalled.mockResolvedValue({
//         status: 200,
//         data: { isInstalled: true }
//       });

//       const result = await utils.getAliExist();

//       expect(result).toBe(true);
//     });

//     it('should return false when Alipay is not installed', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.canUseBridge.mockReturnValue(true);
//       global.JOJO.bridge.isAppInstalled.mockResolvedValue({
//         status: 200,
//         data: { isInstalled: false }
//       });

//       const result = await utils.getAliExist();

//       expect(result).toBe(false);
//     });

//     it('should return true when not in app', async () => {
//       const originalApp = global.JOJO.Os.app;
//       global.JOJO.Os.app = false;

//       const result = await utils.getAliExist();

//       expect(result).toBe(true); // 默认值是 true
//       global.JOJO.Os.app = originalApp;
//     });

//     it('should handle errors when checking Alipay installation', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.canUseBridge.mockReturnValue(true);
//       global.JOJO.bridge.isAppInstalled.mockRejectedValue(new Error('Failed to check'));

//       const result = await utils.getAliExist();

//       expect(result).toBe(false);
//     });
//   });

//   describe('getWxExist', () => {
//     it('should return true when WeChat is installed', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.canUseBridge.mockReturnValue(true);
//       global.JOJO.bridge.isWechatInstalled.mockResolvedValue({
//         status: 200,
//         data: { isInstalled: true }
//       });

//       const result = await utils.getWxExist();

//       expect(result).toBe(true);
//     });

//     it('should return false when WeChat is not installed', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.canUseBridge.mockReturnValue(true);
//       global.JOJO.bridge.isWechatInstalled.mockResolvedValue({
//         status: 200,
//         data: { isInstalled: false }
//       });

//       const result = await utils.getWxExist();

//       expect(result).toBe(false);
//     });

//     it('should handle errors when checking WeChat installation', async () => {
//       global.JOJO.Os.app = true;
//       global.JOJO.bridge.canUseBridge.mockReturnValue(true);
//       global.JOJO.bridge.isWechatInstalled.mockRejectedValue(new Error('Failed to check'));

//       const result = await utils.getWxExist();

//       expect(result).toBe(false);
//     });
//   });

//   describe('urlToBase64', () => {
//     it('should reject when URL is not provided', async () => {
//       await expect(utils.urlToBase64('', { outputFormat: 'image/png' })).rejects.toThrow(
//         'URL is required'
//       );
//     });
//   });

//   describe('capture', () => {
//     it('should reject when node element is not provided', async () => {
//       await expect(utils.capture(null as any)).rejects.toThrow('Node element is required');
//     });
//   });
// });
