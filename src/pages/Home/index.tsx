import S from './index.module.less';
import { Button } from 'antd-mobile';
import { Toast } from 'antd-mobile';

export default function Home() {
  Toast.show('Hello World');
  return (
    <div className={S.container}>
      <h1>Home</h1>
      <Button>Button</Button>
    </div>
  );
}
