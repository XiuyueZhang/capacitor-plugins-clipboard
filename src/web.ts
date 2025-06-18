import { WebPlugin } from '@capacitor/core';

import type { YueClipboardPlugin, ClipboardWriteOptions, ClipboardReadResult } from './definitions';

// Extended Clipboard API types (inline to avoid rollup issues)
interface ExtendedClipboardItem {
  readonly types: readonly string[];
  getType(type: string): Promise<Blob>;
}

interface ExtendedClipboard {
  readText(): Promise<string>;
  writeText(data: string): Promise<void>;
  read?(): Promise<ExtendedClipboardItem[]>;
  write?(data: ExtendedClipboardItem[]): Promise<void>;
}

type ExtendedNavigator = Navigator & {
  clipboard: ExtendedClipboard;
};

type ExtendedWindow = Window & {
  ClipboardItem: {
    new (items: Record<string, Blob | string | Promise<Blob | string>>): ExtendedClipboardItem;
  };
};

export class YueClipboardWeb extends WebPlugin implements YueClipboardPlugin {
  constructor() {
    super();
    console.log('Clipboard plugin running in Web mode. Using browser Clipboard API.');
  }

  async write(options: ClipboardWriteOptions): Promise<void> {
    try {
      const extendedNavigator = navigator as ExtendedNavigator;
      if (!extendedNavigator.clipboard) {
        throw new Error('Clipboard API not supported in this browser');
      }

      // Handle different content types
      if (options.string) {
        await extendedNavigator.clipboard.writeText(options.string);
        console.log('Web: Text written to clipboard');
      } else if (options.url) {
        await extendedNavigator.clipboard.writeText(options.url);
        console.log('Web: URL written to clipboard as text');
      } else if (options.image) {
        // For images, we need to use the more complex ClipboardItem API
        const extendedWindow = window as unknown as ExtendedWindow;
        if (typeof extendedWindow.ClipboardItem !== 'undefined') {
          let blob: Blob;
          if (options.image.startsWith('data:')) {
            // Handle base64 data URLs
            const response = await fetch(options.image);
            blob = await response.blob();
          } else {
            // Handle image URLs
            const response = await fetch(options.image);
            blob = await response.blob();
          }
          
          const clipboardItem = new extendedWindow.ClipboardItem({ [blob.type]: blob });
          if (extendedNavigator.clipboard.write) {
            await extendedNavigator.clipboard.write([clipboardItem]);
          }
          console.log('Web: Image written to clipboard');
        } else {
          throw new Error('ClipboardItem API not supported for image copying');
        }
      }
    } catch (error) {
      console.error('Web: Failed to write to clipboard:', error);
      throw error;
    }
  }

  async read(): Promise<ClipboardReadResult> {
    try {
      const extendedNavigator = navigator as ExtendedNavigator;
      if (!extendedNavigator.clipboard) {
        throw new Error('Clipboard API not supported in this browser');
      }

      // Try to read text first (most common case)
      const text = await extendedNavigator.clipboard.readText();
      if (text) {
        // Check if it's a URL
        const urlPattern = /^https?:\/\/.+/i;
        const type = urlPattern.test(text) ? 'url' : 'text';
        
        console.log('Web: Read from clipboard:', type);
        return { value: text, type: type as 'text' | 'url' };
      }

      // Try to read other content types if available
      const extendedWindow = window as unknown as ExtendedWindow;
      if (typeof extendedWindow.ClipboardItem !== 'undefined' && extendedNavigator.clipboard.read) {
        const clipboardItems = await extendedNavigator.clipboard.read();
        for (const item of clipboardItems) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              const blob = await item.getType(type);
              const dataUrl = await this.blobToDataUrl(blob);
              console.log('Web: Read image from clipboard');
              return { value: dataUrl, type: 'image' };
            }
          }
        }
      }

      return { value: '', type: 'text' };
    } catch (error) {
      console.error('Web: Failed to read from clipboard:', error);
      throw error;
    }
  }

  async hasContent(): Promise<{ hasContent: boolean }> {
    try {
      const extendedNavigator = navigator as ExtendedNavigator;
      if (!extendedNavigator.clipboard) {
        return { hasContent: false };
      }

      // Check for text content
      const text = await extendedNavigator.clipboard.readText();
      if (text && text.length > 0) {
        return { hasContent: true };
      }

      // Check for other content types if available
      const extendedWindow = window as unknown as ExtendedWindow;
      if (typeof extendedWindow.ClipboardItem !== 'undefined' && extendedNavigator.clipboard.read) {
        const clipboardItems = await extendedNavigator.clipboard.read();
        return { hasContent: clipboardItems.length > 0 };
      }

      return { hasContent: false };
    } catch (error) {
      console.error('Web: Failed to check clipboard content:', error);
      return { hasContent: false };
    }
  }

  async clear(): Promise<void> {
    try {
      const extendedNavigator = navigator as ExtendedNavigator;
      if (!extendedNavigator.clipboard) {
        throw new Error('Clipboard API not supported in this browser');
      }

      await extendedNavigator.clipboard.writeText('');
      console.log('Web: Clipboard cleared');
    } catch (error) {
      console.error('Web: Failed to clear clipboard:', error);
      throw error;
    }
  }

  async getAvailableTypes(): Promise<{ types: string[] }> {
    try {
      const extendedNavigator = navigator as ExtendedNavigator;
      if (!extendedNavigator.clipboard) {
        return { types: [] };
      }

      const types: string[] = [];

      // Check for text
      const text = await extendedNavigator.clipboard.readText();
      if (text && text.length > 0) {
        const urlPattern = /^https?:\/\/.+/i;
        types.push(urlPattern.test(text) ? 'url' : 'text');
      }

      // Check for other content types if available
      const extendedWindow = window as unknown as ExtendedWindow;
      if (typeof extendedWindow.ClipboardItem !== 'undefined' && extendedNavigator.clipboard.read) {
        const clipboardItems = await extendedNavigator.clipboard.read();
        for (const item of clipboardItems) {
          for (const type of item.types) {
            if (type.startsWith('image/') && !types.includes('image')) {
              types.push('image');
            }
          }
        }
      }

      console.log('Web: Available clipboard types:', types);
      return { types };
    } catch (error) {
      console.error('Web: Failed to get available types:', error);
      return { types: [] };
    }
  }

  private async blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
