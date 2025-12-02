/**
 * 初始化JJ全局变量
 * @returns
 */
export const initJJ = async () => {
  if (!window.JJ) window.JJ = { Os: {} };

  // 异步加载模块
  const [os, utils, request, navigate, loading, toast, popup] = await Promise.all([
    import('./os'),
    import('./utils/index'),
    import('./request').catch(() => null),
    import('./navigate').catch(() => null),
    import('./loading').catch(() => null),
    import('./toast').catch(() => null),
    import('./popup').catch(() => null)
  ]);

  Object.assign(window.JJ, {
    Os: { ...window.JJ.Os, ...os.default },
    Utils: utils?.default,
    request: request?.default,
    navigate: navigate?.default,
    loading: loading?.default,
    toast: toast?.default,
    popup: popup?.default
  });

  return window.JJ;
};

// initJJ();
