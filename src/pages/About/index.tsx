import { useEffect } from 'react';

import { getDetail } from '@/services/api';

export default function About() {
  useEffect(() => {
    getDetail({ linkCode: 'PLvMVsMwIys' }).then((res) => {
      console.log(111111222, res);
    });
  }, []);

  const handleClick = () => JOJO.showPage('/home');

  return (
    <div>
      <div onClick={handleClick}>About</div>
    </div>
  );
}
