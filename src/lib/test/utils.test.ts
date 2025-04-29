import { debounce } from '../utils';

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

describe('debounce 函数', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	test('基础调用 - 函数应被调用', () => {
		const mockFn = vi.fn();
		const debounced = debounce(mockFn, 100);

		debounced();
		vi.advanceTimersByTime(100);

		expect(mockFn).toHaveBeenCalledTimes(1);
	});

	test('防抖效果 - 短时间内多次调用只执行一次', () => {
		const mockFn = vi.fn();
		const debounced = debounce(mockFn, 100);

		debounced();
		debounced();
		debounced();

		vi.advanceTimersByTime(50);
		expect(mockFn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(100);
		expect(mockFn).toHaveBeenCalledTimes(1);
	});

	test('参数传递 - 应正确传递参数', () => {
		const mockFn = vi.fn();
		const debounced = debounce(mockFn, 100);

		debounced(1, 'a', { key: 'value' });
		vi.advanceTimersByTime(100);

		expect(mockFn).toHaveBeenCalledWith(1, 'a', { key: 'value' });
	});

	test('fps = 0 时应立即执行', () => {
		const mockFn = vi.fn();
		const debounced = debounce(mockFn, 0);

		debounced();
		expect(mockFn).toHaveBeenCalledTimes(1);
	});

	test('清理机制 - 应清除前一个定时器', () => {
		const mockFn = vi.fn();
		const debounced = debounce(mockFn, 100);

		debounced('first');
		vi.advanceTimersByTime(50);

		debounced('second');
		vi.advanceTimersByTime(100);

		expect(mockFn).toHaveBeenCalledTimes(1);
		expect(mockFn).toHaveBeenCalledWith('second');
	});

	test('多次延迟调用 - 应分别执行', () => {
		const mockFn = vi.fn();
		const debounced = debounce(mockFn, 100);

		debounced('first');
		vi.advanceTimersByTime(150);

		debounced('second');
		vi.advanceTimersByTime(150);

		expect(mockFn).toHaveBeenCalledTimes(2);
		expect(mockFn).toHaveBeenNthCalledWith(1, 'first');
		expect(mockFn).toHaveBeenNthCalledWith(2, 'second');
	});
});
