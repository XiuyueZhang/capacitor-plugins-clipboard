import { WebPlugin } from '@capacitor/core';

import type { YueFlashlightPlugin } from './definitions';

export class YueFlashlightWeb extends WebPlugin implements YueFlashlightPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
