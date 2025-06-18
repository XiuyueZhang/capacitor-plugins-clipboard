import Foundation
import Capacitor
import UIKit

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(YueClipboardPlugin)
public class YueClipboardPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "YueClipboardPlugin"
    public let jsName = "YueClipboard"

    // Define all methods that will be exposed to JavaScript
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "echo", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "write", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "read", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "hasContent", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "clear", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getAvailableTypes", returnType: CAPPluginReturnPromise)
    ]

    private let implementation = YueClipboard()

    // MARK: - Plugin Method Implementations

    @objc func echo(_ call: CAPPluginCall) {
        let value = call.getString("value") ?? ""
        call.resolve([
            "value": implementation.echo(value)
        ])
    }

    @objc func write(_ call: CAPPluginCall) {
        let text = call.getString("string")
        let image = call.getString("image")
        let url = call.getString("url")

        do {
            try implementation.write(text: text, image: image, url: url)
            call.resolve()
        } catch let error as YueClipboard.ClipboardError {
            call.reject(error.localizedDescription)
        } catch {
            call.reject("Failed to write to clipboard: \(error.localizedDescription)")
        }
    }

    @objc func read(_ call: CAPPluginCall) {
        do {
            let result = try implementation.read()
            call.resolve([
                "value": result.value,
                "type": result.type
            ])
        } catch let error as YueClipboard.ClipboardError {
            call.reject(error.localizedDescription)
        } catch {
            call.reject("Failed to read from clipboard: \(error.localizedDescription)")
        }
    }

    @objc func hasContent(_ call: CAPPluginCall) {
        let hasContent = implementation.hasContent()
        call.resolve(["hasContent": hasContent])
    }

    @objc func clear(_ call: CAPPluginCall) {
        do {
            try implementation.clear()
            call.resolve()
        } catch let error as YueClipboard.ClipboardError {
            call.reject(error.localizedDescription)
        } catch {
            call.reject("Failed to clear clipboard: \(error.localizedDescription)")
        }
    }

    @objc func getAvailableTypes(_ call: CAPPluginCall) {
        let types = implementation.getAvailableTypes()
        call.resolve(["types": types])
    }
}

