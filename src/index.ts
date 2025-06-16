import { registerPlugin } from '@capacitor/core';

import type { YueFlashlightPlugin } from './definitions';

const YueFlashlight = registerPlugin<YueFlashlightPlugin>('YueFlashlight', {
  web: () => import('./web').then((m) => new m.YueFlashlightWeb()),
});

export * from './definitions';
export { YueFlashlight };
