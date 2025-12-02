import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * 获取当前页面的 URL 参数
 * @returns
 *   urlParams: T & Record<string, string>
 *   setUrlParams: (next: Partial<Record<keyof T | string, string | number | boolean | undefined>>, options?: { replace?: boolean }) => void
 */
export function useUrlParams<T extends Record<string, any> = Record<string, string>>() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 读取参数：转成普通对象
  const urlParams = useMemo(() => {
    return Object.fromEntries(searchParams.entries()) as T & Record<string, string>;
  }, [searchParams]);

  // 更新参数
  const setUrlParams = useCallback(
    (
      next: Partial<Record<keyof T | string, string | number | boolean | undefined>>,
      options?: { replace?: boolean }
    ) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(next).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      setSearchParams(newParams, { replace: options?.replace ?? false });
    },
    [searchParams, setSearchParams]
  );

  return { urlParams, setUrlParams };
}

export default useUrlParams;
