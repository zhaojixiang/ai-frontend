import { ErrorBlock } from 'antd-mobile';

import empty from '@/assets/images/empty.svg';
import error from '@/assets/images/error.svg';

export default (props: { status: 'empty' | 'error' }) => {
  const { status } = props || {};

  let image = empty;
  let title = '未查询到数据哦';

  if (status === 'empty') {
    image = empty;
    title = '未查询到数据哦';
  }
  if (status === 'error') {
    image = error;
    title = '错误';
  }

  return <ErrorBlock fullPage image={image} title={title} description='' />;
};
