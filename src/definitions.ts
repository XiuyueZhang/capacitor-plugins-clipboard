declare module '@capacitor/core' {
  interface PluginRegistry {
    YueClipboardPlugin?: YueClipboardPlugin;
  }
}

export interface ClipboardWriteOptions {
  /**
   * The text to write to the clipboard.
   */
  string: string;
  
  /**
   * Optional: The image URL or base64 data to write to the clipboard.
   * Supported formats: PNG, JPEG, GIF (platform dependent).
   */
  image?: string;
  
  /**
   * Optional: The URL to write to the clipboard.
   */
  url?: string;
}

export interface ClipboardReadResult {
  /**
   * The text content from the clipboard.
   */
  value: string;
  
  /**
   * The type of content (text, image, url).
   */
  type: 'text' | 'image' | 'url';
}

export interface YueClipboardPlugin {
  /**
   * Write text, image, or URL to the clipboard.
   * @param options The content to write to clipboard
   */
  write(options: ClipboardWriteOptions): Promise<void>;

  /**
   * Read the current content from the clipboard.
   * @returns Promise<ClipboardReadResult> The clipboard content and its type
   */
  read(): Promise<ClipboardReadResult>;

  /**
   * Check if the clipboard contains any content.
   * @returns Promise<{ hasContent: boolean }> True if clipboard has content
   */
  hasContent(): Promise<{ hasContent: boolean }>;

  /**
   * Clear all content from the clipboard.
   */
  clear(): Promise<void>;

  /**
   * Check what types of content are available in the clipboard.
   * @returns Promise<{ types: string[] }> Array of available content types
   */
  getAvailableTypes(): Promise<{ types: string[] }>;
}
