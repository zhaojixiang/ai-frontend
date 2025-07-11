# 启动项目

本地开发时的环境变量都定义在`envs`文件夹中，启动项目时传入不同的`mode`获取不用环境的环境变量配置

- `dev`环境：`pnpm start --mode dev`
- `fat`环境：`pnpm start --mode fat`
- `uat`环境：`pnpm start --mode uat`

# 编码

## 全局对象 JOJO

`JOJO` 对象中存储了一些全局变量

注意：由于vite在开发阶段会使用ESM对代码进行静态解析，因此在顶层代码使用`JOJO`时，`JOJO`可能还未完成初始化，因此会获取不到`JOJO`的值，所以请在函数内部使用它。

```js
import React from 'react';

// 这里无法获取到JOJO
console.log(JOJO);

export default () => {
  // 在函数内部才能获取到JOJO
  console.log(JOJO);
  return <div>JOJO</div>;
};
```

当需要在顶层使用时，请勿直接使用`JOJO`全局对象，应手动导入`JOJO`上挂载的对象，`JOJO`上挂载的对象都会在`@/lib/jojo`中进行导出，效果与直接使用`JOJO`全局对象一致。

```js
import React from 'react';

// 在顶层使用需手动导入
import { Os, request, showPage, Utils } from '@/lib/jojo';

console.log(Os, request, showPage, Utils);

export default () => {
  // 在函数内部依然使用JOJO全局变量
  console.log(JOJO.Os.jojoup, JOJO.request, JOJO.showPage, JOJO.Utils);

  return <div>JOJO</div>;
};
```

### Os

Os 对象中存储了一些设备信息，详细信息请看 `@lib/os/index.js`

```js
JOJO.OS.jojoup; // 是否是jojoup环境
```

### Utils

Utils 对象中存储了一些工具函数，详细信息请看 `@lib/utils/index.ts`

```js
JOJO.Utils.getQueryString(); // 获取url参数
```

### showPage

showPage 函数用于跳转到指定的页面，详细信息请看 `@lib/showPage/index.ts`

```js
JOJO.showPage('/home/index');
```

### request

request 函数用于发送请求，详细信息请看 `@lib/request/index.ts`

```js
JOJO.request('/api/test', { method: 'GET' });
```

### loading

loading 是对 antd-mobile toast 的封装，配置项与 antd-mobile toast 一致，详细信息请看 `@lib/loading/index.ts`

```js
JOJO.loading.open({ content: '加载中...' });
JOJO.loading.close();
```

### toast

toast 是对 antd-mobile toast 的封装，配置项与 antd-mobile toast 一致，详细信息请看 `@lib/toast/index.ts`

```js
JOJO.toast.show({ content: '请求中' });
JOJO.toast.error({ content: '请求失败' });

JOJO.toast.success({
  content: '请求成功',
  afterClose: () => {
    console.log('toast关闭回调');
  }
});

JOJO.toast.close();
```
