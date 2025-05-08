import { debounce } from '../utils';

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
