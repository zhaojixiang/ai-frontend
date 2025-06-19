import { Button } from 'antd-mobile';

import S from './index.module.less';

export default function Home() {
  // Toast.show('Hello World');
  console.log(2222, import.meta.env.VITE_APP_NAME);

  return (
    <div className={S.container}>
      <h1 onClick={() => JOJO.showPage('https://mall.fat.tinman.cn/order/list', { to: 'flutter' })}>
        Home
      </h1>
      <div>111</div>
      <Button>Button</Button>
    </div>
  );
}
