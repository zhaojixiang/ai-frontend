import React, { useEffect } from 'react';
import { getDetail } from '@/services/api';
import { Toast } from 'antd-mobile';
export default function About() {
  useEffect(() => {
    getDetail({ linkCode: 'PLvMVsMwIys' }).then((res) => {
      console.log(111111222, res);
    });
  }, []);
  return (
    <div>
      <h1 onClick={() => JOJO.showPage('/home')}>About</h1>
    </div>
  );
}
