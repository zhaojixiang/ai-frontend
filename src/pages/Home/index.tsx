import { Button, Toast } from 'antd-mobile';
import { t } from 'i18next';

export default function Home() {
  console.log('环境变量：', import.meta.env);

  return (
    <div>
      <Button
        onClick={() => {
          Toast.show('点击了按钮');
        }}>
        {t('thisIsTheFrontPage', '当前环境: ') as string}
        {import.meta.env.VITE_ENV_NAME}
      </Button>
    </div>
  );
}
