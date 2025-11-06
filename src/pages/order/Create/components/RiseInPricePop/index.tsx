import cx from 'classnames';

import type { IJingTanParams } from '@/modules/customerService';
import { getJingTanPath, getOriginParams } from '@/modules/customerService';

import S from './index.module.less';

export default (props: { onClose: () => void }) => {
  const { onClose } = props;
  // 联系客服
  const handleCustomer = async () => {
    const originParams = await getOriginParams();
    const url = getJingTanPath({
      ...originParams
    } as IJingTanParams);
    window.location.href = url;
    onClose();
  };
  return (
    <div className={S.cancelApply_wrap}>
      <div className={S.desc}>商品价格发生变化，请联系客服提供新下单链接～</div>
      <div className={S.btn_wrap}>
        <div className={cx(S.btn, S.cancel)} onClick={onClose}>
          知道了
        </div>
        <div onClick={handleCustomer}>
          <div className={cx(S.btn, S.confirm)}>联系客服</div>
        </div>
      </div>
    </div>
  );
};
