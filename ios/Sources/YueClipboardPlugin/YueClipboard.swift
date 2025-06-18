import Foundation
import UIKit

@objc public class YueClipboard: NSObject {

    // MARK: - Clipboard Operations

    @objc public func write(text: String?, image: String?, url: String?) throws {
        let pasteboard = UIPasteboard.general
        
        // Clear the pasteboard first
        pasteboard.items = []
        
        if let text = text, !text.isEmpty {
            // Write text to clipboard
            pasteboard.string = text
            print("Text written to clipboard")
        } else if let url = url, !url.isEmpty {
            // Write URL to clipboard
            pasteboard.string = url
            print("URL written to clipboard")
        } else if let imageData = image, !imageData.isEmpty {
            // Handle image data (base64 or URL)
            if imageData.hasPrefix("data:image/") {
                // Handle base64 data URL
                if let data = dataFromDataURL(imageData) {
                    if let uiImage = UIImage(data: data) {
                        pasteboard.image = uiImage
                        print("Image written to clipboard from data URL")
                    } else {
                        // Fallback to storing as text
                        pasteboard.string = imageData
                        print("Image data written to clipboard as text (invalid image data)")
                    }
                } else {
                    throw ClipboardError.invalidImageData
                }
            } else if let imageURL = URL(string: imageData) {
                // Handle image URL - download and convert to image
                do {
                    let data = try Data(contentsOf: imageURL)
                    if let uiImage = UIImage(data: data) {
                        pasteboard.image = uiImage
                        print("Image written to clipboard from URL")
                    } else {
                        throw ClipboardError.invalidImageData
                    }
                } catch {
                    throw ClipboardError.failedToLoadImage(error.localizedDescription)
                }
            } else {
                // Store as text if not a valid URL or data URL
                pasteboard.string = imageData
                print("Image data written to clipboard as text")
            }
        } else {
            throw ClipboardError.noValidContent
        }
    }

    @objc public func read() throws -> ClipboardReadResult {
        let pasteboard = UIPasteboard.general
        
        // Check for image first
        if let image = pasteboard.image {
            // Convert image to base64 data URL
            if let data = image.pngData() {
                let base64String = data.base64EncodedString()
                let dataURL = "data:image/png;base64,\(base64String)"
                print("Read image from clipboard")
                return ClipboardReadResult(value: dataURL, type: "image")
            }
        }
        
        // Check for text/URL
        if let string = pasteboard.string {
            let urlPattern = "^https?://.*"
            let regex = try NSRegularExpression(pattern: urlPattern, options: .caseInsensitive)
            let range = NSRange(location: 0, length: string.utf16.count)
            
            if regex.firstMatch(in: string, options: [], range: range) != nil {
                print("Read URL from clipboard")
                return ClipboardReadResult(value: string, type: "url")
            } else {
                print("Read text from clipboard")
                return ClipboardReadResult(value: string, type: "text")
            }
        }
        
        // No content found
        return ClipboardReadResult(value: "", type: "text")
    }

    @objc public func hasContent() -> Bool {
        let pasteboard = UIPasteboard.general
        return pasteboard.hasStrings || pasteboard.hasImages
    }

    @objc public func clear() throws {
        let pasteboard = UIPasteboard.general
        pasteboard.items = []
        print("Clipboard cleared")
    }

    @objc public func getAvailableTypes() -> [String] {
        let pasteboard = UIPasteboard.general
        var types: [String] = []
        
        if pasteboard.hasImages {
            types.append("image")
        }
        
        if pasteboard.hasStrings, let string = pasteboard.string {
            let urlPattern = "^https?://.*"
            do {
                let regex = try NSRegularExpression(pattern: urlPattern, options: .caseInsensitive)
                let range = NSRange(location: 0, length: string.utf16.count)
                
                if regex.firstMatch(in: string, options: [], range: range) != nil {
                    types.append("url")
                } else {
                    types.append("text")
                }
            } catch {
                types.append("text") // Default to text if regex fails
            }
        }
        
        print("Available clipboard types: \(types)")
        return types
    }

    // MARK: - Helper Methods

    private func dataFromDataURL(_ dataURL: String) -> Data? {
        let components = dataURL.components(separatedBy: ",")
        if components.count == 2 {
            let base64String = components[1]
            return Data(base64Encoded: base64String)
        }
        return nil
    }

    // MARK: - Error Handling

    enum ClipboardError: Error, LocalizedError {
        case noValidContent
        case invalidImageData
        case failedToLoadImage(String)

        public var errorDescription: String? {
            switch self {
            case .noValidContent:
                return "No valid content provided to write to clipboard."
            case .invalidImageData:
                return "Invalid image data provided."
            case .failedToLoadImage(let message):
                return "Failed to load image: \(message)"
            }
        }
    }

    // MARK: - Result Helper

    @objc public class ClipboardReadResult: NSObject {
        @objc public let value: String
        @objc public let type: String
        
        @objc public init(value: String, type: String) {
            self.value = value
            self.type = type
        }
    }

    // Original echo method (kept for reference)
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
