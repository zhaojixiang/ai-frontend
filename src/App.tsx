import './App.less';
import './style/global.less';

import { Outlet } from 'react-router-dom';

import DebugTool from '@/lib/debugger/DebugTool';
import { Os } from '@/lib/jojo';

function App() {
  return (
    <>
      <Outlet />
      {Os.debug && <DebugTool />}
    </>
  );
}

export default App;
