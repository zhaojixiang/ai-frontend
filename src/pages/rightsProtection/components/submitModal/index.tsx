import { Mask } from 'antd-mobile';

import styles from './index.module.less';

const SubmitModal = (props) => {
  const { visible, onCancel, onSubmit } = props;
  return (
    <Mask
      visible={visible}
      onMaskClick={() => {
        onCancel();
      }}
      className={styles['submit-modal']}>
      <div className={styles.container}>
        <div className={styles.title}>确认后将为您更换新赠课赠品，原有 赠课赠品将会被回收</div>
        <div
          className={styles.btn}
          onClick={() => {
            onSubmit();
            onCancel();
          }}>
          确认升级
        </div>
      </div>
    </Mask>
  );
};

export default SubmitModal;
