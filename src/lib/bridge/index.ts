import JsBridge from '@woulsl-app/js-bridge';

import Os from '@/lib/os';

function initBridge() {
  if (Os?.app) {
    return new JsBridge();
  }
  return {};
}

const bridge = initBridge();

// export const callBridgeMethod = (method: string, params: any) => {
//   if (bridge && bridge.call) {
//     return bridge.call(method, params);
//   }
//   console.warn(`Bridge method ${method} is not available.`);
// };

export default bridge;
