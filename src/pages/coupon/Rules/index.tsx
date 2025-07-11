import React from 'react';
import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { ErrorFallback } from '@/components/ErrorFallback';
import { Loading } from '@/components/Loading';
import { getCouponActivityDetail } from '@/services/api';

import S from './index.module.less';

const Index: React.FC<any> = () => {
  const [searchParams] = useSearchParams();
  const activityId = searchParams.get('activityId') || '';

  // 获取活动详情
  const {
    data: pageData,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['getCouponActivityDetail'],
    queryFn: () => getCouponActivityDetail({ activityId })
  });
  const { resultCode, data: activityDetail } = pageData || {};

  const { activityDescription } = activityDetail || {};

  // 活动描述
  let detailArr = [];
  if (typeof activityDescription === 'string' && activityDescription.length) {
    detailArr = activityDescription.split('$$');
  } else {
    return null;
  }

  // loading
  if (isLoading) return <Loading />;
  // 异常处理
  if (resultCode !== 200) return <ErrorFallback onRetry={refetch} />;

  return (
    <main className={S.rules}>
      {detailArr.map((d, i) => (
        <div key={i}>{d}</div>
      ))}
    </main>
  );
};

export default Index;
