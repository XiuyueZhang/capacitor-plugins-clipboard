package xiuyue.tech.plugins.clipboard;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.util.Base64;
import android.util.Log;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class YueClipboard {

    private static final String TAG = "YueClipboard";
    private ClipboardManager clipboardManager;
    private Context context;

    public YueClipboard(Context context) {
        this.context = context;
        this.clipboardManager = (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
    }

    public void write(String text, String imageData, String url) throws ClipboardException {
        try {
            if (text != null && !text.isEmpty()) {
                ClipData clip = ClipData.newPlainText("text", text);
                clipboardManager.setPrimaryClip(clip);
                Log.d(TAG, "Text written to clipboard");
            } else if (url != null && !url.isEmpty()) {
                ClipData clip = ClipData.newPlainText("url", url);
                clipboardManager.setPrimaryClip(clip);
                Log.d(TAG, "URL written to clipboard");
            } else if (imageData != null && !imageData.isEmpty()) {
                // For images, we'll store as URI or convert to text representation
                // Android clipboard primarily handles text, URI, and Intent data
                // For images, we can store the data URL as text
                ClipData clip = ClipData.newPlainText("image", imageData);
                clipboardManager.setPrimaryClip(clip);
                Log.d(TAG, "Image data written to clipboard as text");
            } else {
                throw new ClipboardException("No valid content provided to write to clipboard");
            }
        } catch (Exception e) {
            throw new ClipboardException("Failed to write to clipboard: " + e.getMessage(), e);
        }
    }

    public ClipboardReadResult read() throws ClipboardException {
        try {
            if (!clipboardManager.hasPrimaryClip()) {
                return new ClipboardReadResult("", "text");
            }

            ClipData clip = clipboardManager.getPrimaryClip();
            if (clip == null || clip.getItemCount() == 0) {
                return new ClipboardReadResult("", "text");
            }

            ClipData.Item item = clip.getItemAt(0);
            String text = "";
            String type = "text";

            // Check for text content
            if (item.getText() != null) {
                text = item.getText().toString();
                
                // Determine content type based on content
                if (text.startsWith("data:image/")) {
                    type = "image";
                } else if (text.matches("^https?://.*")) {
                    type = "url";
                } else {
                    type = "text";
                }
            } else if (item.getUri() != null) {
                // Handle URI content
                Uri uri = item.getUri();
                text = uri.toString();
                type = "url";
            }

            Log.d(TAG, "Read from clipboard: " + type);
            return new ClipboardReadResult(text, type);
        } catch (Exception e) {
            throw new ClipboardException("Failed to read from clipboard: " + e.getMessage(), e);
        }
    }

    public boolean hasContent() {
        try {
            return clipboardManager.hasPrimaryClip() && 
                   clipboardManager.getPrimaryClip() != null &&
                   clipboardManager.getPrimaryClip().getItemCount() > 0;
        } catch (Exception e) {
            Log.e(TAG, "Failed to check clipboard content: " + e.getMessage());
            return false;
        }
    }

    public void clear() throws ClipboardException {
        try {
            ClipData clip = ClipData.newPlainText("", "");
            clipboardManager.setPrimaryClip(clip);
            Log.d(TAG, "Clipboard cleared");
        } catch (Exception e) {
            throw new ClipboardException("Failed to clear clipboard: " + e.getMessage(), e);
        }
    }

    public List<String> getAvailableTypes() {
        List<String> types = new ArrayList<>();
        
        try {
            if (!clipboardManager.hasPrimaryClip()) {
                return types;
            }

            ClipData clip = clipboardManager.getPrimaryClip();
            if (clip == null || clip.getItemCount() == 0) {
                return types;
            }

            ClipData.Item item = clip.getItemAt(0);

            if (item.getText() != null) {
                String text = item.getText().toString();
                if (text.startsWith("data:image/")) {
                    types.add("image");
                } else if (text.matches("^https?://.*")) {
                    types.add("url");
                } else {
                    types.add("text");
                }
            }

            if (item.getUri() != null) {
                if (!types.contains("url")) {
                    types.add("url");
                }
            }

            Log.d(TAG, "Available clipboard types: " + types.toString());
        } catch (Exception e) {
            Log.e(TAG, "Failed to get available types: " + e.getMessage());
        }

        return types;
    }

    // Helper class for read results
    public static class ClipboardReadResult {
        public final String value;
        public final String type;

        public ClipboardReadResult(String value, String type) {
            this.value = value;
            this.type = type;
        }
    }

    // Custom exception for clipboard operations
    public static class ClipboardException extends Exception {
        public ClipboardException(String message) {
            super(message);
        }
        public ClipboardException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    // Original echo method (kept for reference)
    public String echo(String value) {
        Log.i("Echo", value);
        return value;
    }
}
