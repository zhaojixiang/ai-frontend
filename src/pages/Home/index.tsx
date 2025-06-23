import { Button, Swiper, Toast } from 'antd-mobile';
import { t } from 'i18next';

import styles from './index.module.less';

const colors = ['#ace0ff', '#bcffbd', '#e4fabd', '#ffcfac'];

const items = colors.map((color, index) => (
  <Swiper.Item key={index}>
    <div
      className={styles.content}
      style={{ background: color }}
      onClick={() => {
        Toast.show(`你点击了卡片 ${index + 1}`);
      }}>
      {index + 1}
    </div>
  </Swiper.Item>
));

export default function Home() {
  return (
    <div>
      <Swiper
        loop
        autoplay
        onIndexChange={(i) => {
          console.log(i, 'onIndexChange1');
        }}>
        {items}
      </Swiper>
      <Button
        onClick={() => {
          Toast.show('点击了按钮');
        }}>
        {t('thisIsTheFrontPage', '这是首页') as string}
      </Button>
    </div>
  );
}
