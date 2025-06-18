package xiuyue.tech.plugins.clipboard;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.List;

@CapacitorPlugin(name = "YueClipboard")
public class YueClipboardPlugin extends Plugin {

    // Initialize implementation with the context from the plugin
    private YueClipboard implementation;

    @Override
    public void load() {
        super.load();
        // Initialize the implementation when the plugin loads
        implementation = new YueClipboard(getContext());
    }

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");
        JSObject ret = new JSObject();
        ret.put("value", implementation.echo(value));
        call.resolve(ret);
    }

    @PluginMethod
    public void write(PluginCall call) {
        String text = call.getString("string");
        String image = call.getString("image");
        String url = call.getString("url");

        try {
            implementation.write(text, image, url);
            call.resolve();
        } catch (YueClipboard.ClipboardException e) {
            call.reject("CapacitorException: " + e.getMessage());
        } catch (Exception e) {
            call.reject("CapacitorException: Failed to write to clipboard: " + e.getMessage());
        }
    }

    @PluginMethod
    public void read(PluginCall call) {
        try {
            YueClipboard.ClipboardReadResult result = implementation.read();
            JSObject ret = new JSObject();
            ret.put("value", result.value);
            ret.put("type", result.type);
            call.resolve(ret);
        } catch (YueClipboard.ClipboardException e) {
            call.reject("CapacitorException: " + e.getMessage());
        } catch (Exception e) {
            call.reject("CapacitorException: Failed to read from clipboard: " + e.getMessage());
        }
    }

    @PluginMethod
    public void hasContent(PluginCall call) {
        try {
            boolean hasContent = implementation.hasContent();
            JSObject ret = new JSObject();
            ret.put("hasContent", hasContent);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("CapacitorException: Failed to check clipboard content: " + e.getMessage());
        }
    }

    @PluginMethod
    public void clear(PluginCall call) {
        try {
            implementation.clear();
            call.resolve();
        } catch (YueClipboard.ClipboardException e) {
            call.reject("CapacitorException: " + e.getMessage());
        } catch (Exception e) {
            call.reject("CapacitorException: Failed to clear clipboard: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getAvailableTypes(PluginCall call) {
        try {
            List<String> types = implementation.getAvailableTypes();
            JSArray typesArray = new JSArray();
            for (String type : types) {
                typesArray.put(type);
            }
            
            JSObject ret = new JSObject();
            ret.put("types", typesArray);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("CapacitorException: Failed to get available types: " + e.getMessage());
        }
    }
}
