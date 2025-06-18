# yue-clipboard

Clipboard Control Plugin - Allows your web app to access clipboard and can read/write or clear the clipboard.

## Install

```bash
npm install yue-clipboard
npx cap sync
```

## API

<docgen-index>

* [`write(...)`](#write)
* [`read()`](#read)
* [`hasContent()`](#hascontent)
* [`clear()`](#clear)
* [`getAvailableTypes()`](#getavailabletypes)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### write(...)

```typescript
write(options: ClipboardWriteOptions) => Promise<void>
```

Write text, image, or URL to the clipboard.

| Param         | Type                                                                    | Description                       |
| ------------- | ----------------------------------------------------------------------- | --------------------------------- |
| **`options`** | <code><a href="#clipboardwriteoptions">ClipboardWriteOptions</a></code> | The content to write to clipboard |

--------------------


### read()

```typescript
read() => Promise<ClipboardReadResult>
```

Read the current content from the clipboard.

**Returns:** <code>Promise&lt;<a href="#clipboardreadresult">ClipboardReadResult</a>&gt;</code>

--------------------


### hasContent()

```typescript
hasContent() => Promise<{ hasContent: boolean; }>
```

Check if the clipboard contains any content.

**Returns:** <code>Promise&lt;{ hasContent: boolean; }&gt;</code>

--------------------


### clear()

```typescript
clear() => Promise<void>
```

Clear all content from the clipboard.

--------------------


### getAvailableTypes()

```typescript
getAvailableTypes() => Promise<{ types: string[]; }>
```

Check what types of content are available in the clipboard.

**Returns:** <code>Promise&lt;{ types: string[]; }&gt;</code>

--------------------


### Interfaces


#### ClipboardWriteOptions

| Prop         | Type                | Description                                                                                                               |
| ------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **`string`** | <code>string</code> | The text to write to the clipboard.                                                                                       |
| **`image`**  | <code>string</code> | Optional: The image URL or base64 data to write to the clipboard. Supported formats: PNG, JPEG, GIF (platform dependent). |
| **`url`**    | <code>string</code> | Optional: The URL to write to the clipboard.                                                                              |


#### ClipboardReadResult

| Prop        | Type                                    | Description                             |
| ----------- | --------------------------------------- | --------------------------------------- |
| **`value`** | <code>string</code>                     | The text content from the clipboard.    |
| **`type`**  | <code>'url' \| 'text' \| 'image'</code> | The type of content (text, image, url). |

</docgen-api>
