import { registerPlugin } from '@capacitor/core';

import type { YueClipboardPlugin } from './definitions';

const YueClipboard = registerPlugin<YueClipboardPlugin>('YueClipboard', {
  web: () => import('./web').then((m) => new m.YueClipboardWeb()),
});

export * from './definitions';
export { YueClipboard };
