import { Suspense } from 'react';

import GlobalLoading from '../components/GlobalLoading';

export const withSuspense = (
  element: React.ReactNode,
  fallback: React.ReactNode = <GlobalLoading />
) => {
  return <Suspense fallback={fallback}>{element}</Suspense>;
};
