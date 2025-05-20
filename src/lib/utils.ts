/**
 * 惰性执行，去抖动
 * 函数在被调用fps秒才会被执行，如果中间被打断，则继续向后顺延fps秒
 * @param {function} fn
 * @param {number} [fps=60]
 * @returns {function}
 */
export function debounce(fn: (...args: any[]) => void, fps = 60) {
  let ST: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (fps > 0) {
      clearTimeout(ST!);
      ST = setTimeout(() => {
        fn(...args);
      }, fps);
    } else {
      fn(...args);
    }
  };
}

/**
 * 事件被第一次触发后，立即执行，当过了fps后才能再次响应执行
 * @param {function} fn
 * @param {number} [fps=60]
 * @returns {Function}
 */
export function throttle(fn: (...args: any[]) => void, fps = 60) {
  let disabled = false;

  return (...args: any[]) => {
    if (!disabled) {
      disabled = true;
      fn(...args);

      setTimeout(() => {
        disabled = false;
      }, fps);
    }
  };
}

/**
 * 以某个频率做某件事情，且第一次、最后一次调用必然会被触发
 * @param {function} fn
 * @param {number} [fps=60]
 * @returns {function}
 */
export function frequency(fn: (...args: any[]) => void, fps = 60) {
  let time = 0;
  let now = time;
  let ST: NodeJS.Timeout | null = null;
  const newFn = (...args: any[]) => {
    clearTimeout(ST!);
    now = Date.now();
    const distance = now - time;

    if (distance >= fps) {
      time = now;
      fn(...args);
    } else {
      ST = setTimeout(() => {
        newFn(...args);
      }, distance);
    }
  };
  return newFn;
}

export default {
  debounce,
  throttle,
  frequency
};
