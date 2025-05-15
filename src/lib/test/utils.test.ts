import { debounce, throttle, frequency } from '../utils';

describe('debounce', () => {
  jest.useFakeTimers(); // 使用 Jest 的假定时器

  it('should call the function after the specified delay', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled(); // 函数不应立即调用

    jest.advanceTimersByTime(99); // 快进 99ms
    expect(mockFn).not.toHaveBeenCalled(); // 函数仍不应调用

    jest.advanceTimersByTime(1); // 快进 1ms
    expect(mockFn).toHaveBeenCalledTimes(1); // 函数应被调用一次
  });

  it('should only call the function once if called multiple times within the delay', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    jest.advanceTimersByTime(100); // 快进 100ms
    expect(mockFn).toHaveBeenCalledTimes(1); // 函数应只被调用一次
  });

  it('should call the function immediately if fps is 0', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 0);

    debouncedFn();
    expect(mockFn).toHaveBeenCalledTimes(1); // 函数应立即调用
  });

  it('should pass the correct arguments to the function', () => {
    const mockFn = jest.fn();
    const debouncedFn = debounce(mockFn, 100);

    debouncedFn('arg1', 'arg2');
    jest.advanceTimersByTime(100); // 快进 100ms
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2'); // 函数应接收到正确的参数
  });
});

describe('throttle', () => {
  jest.useFakeTimers(); // 使用 Jest 的假定时器

  it('should call the function immediately on the first call', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1); // 第一次调用立即执行
  });

  it('should not call the function again within the throttle time', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn();
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1); // 在 throttle 时间内，第二次调用不会执行
  });

  it('should call the function again after the throttle time', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn();
    jest.advanceTimersByTime(50); // 模拟时间过去 50ms
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(1); // 在 throttle 时间内，第二次调用不会执行

    jest.advanceTimersByTime(50); // 模拟时间过去 100ms
    throttledFn();
    expect(mockFn).toHaveBeenCalledTimes(2); // 超过 throttle 时间后，第三次调用会执行
  });

  it('should handle multiple calls correctly', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn();
    jest.advanceTimersByTime(50);
    throttledFn();
    jest.advanceTimersByTime(50);
    throttledFn();
    jest.advanceTimersByTime(100);
    throttledFn();

    expect(mockFn).toHaveBeenCalledTimes(3); // 总共调用 3 次
  });

  it('should pass the correct arguments to the function', () => {
    const mockFn = jest.fn();
    const throttledFn = throttle(mockFn, 100);

    throttledFn('arg1', 'arg2');
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2'); // 确保参数正确传递
  });
});

describe('frequency', () => {
  jest.useFakeTimers(); // 使用 Jest 的假定时器

  it('should call the function immediately on the first call', () => {
    const mockFn = jest.fn();
    const frequencyFn = frequency(mockFn, 100);

    frequencyFn();
    expect(mockFn).toHaveBeenCalledTimes(1); // 第一次调用立即执行
  });

  it('should call the function at the specified frequency', () => {
    const mockFn = jest.fn();
    const frequencyFn = frequency(mockFn, 100);

    frequencyFn(); // 第一次调用立即执行
    jest.advanceTimersByTime(50); // 模拟时间过去 50ms
    frequencyFn(); // 在频率内，不会立即执行
    expect(mockFn).toHaveBeenCalledTimes(1); // 仍然只调用一次

    jest.advanceTimersByTime(50); // 模拟时间过去 100ms
    expect(mockFn).toHaveBeenCalledTimes(2); // 超过频率后，第二次调用执行
  });

  it('should pass the correct arguments to the function', () => {
    const mockFn = jest.fn();
    const frequencyFn = frequency(mockFn, 100);

    frequencyFn('arg1', 'arg2');
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2'); // 确保参数正确传递
  });
});
