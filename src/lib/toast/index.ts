import type { ToastShowProps } from 'antd-mobile';
import { Toast } from 'antd-mobile';

class ToastWrapper {
  private toastHandler: (() => void) | null = null;

  show(options: ToastShowProps) {
    // 如果有未关闭的 toast，先关闭
    this.close();

    this.toastHandler = Toast.show({
      ...options
    }).close;
  }

  error(options: ToastShowProps) {
    this.close();

    this.toastHandler = Toast.show({
      icon: 'fail',
      ...options
    }).close;
  }

  success(options: ToastShowProps) {
    this.close();

    this.toastHandler = Toast.show({
      icon: 'success',
      ...options
    }).close;
  }

  close() {
    if (this.toastHandler) {
      this.toastHandler();
      this.toastHandler = null;
    }
  }
}

const toastInstance = new ToastWrapper();

export default toastInstance;
