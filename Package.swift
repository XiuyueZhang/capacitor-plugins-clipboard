// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "YueClipboard",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "YueClipboard",
            targets: ["YueClipboardPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "YueClipboardPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/YueClipboardPlugin"),
        .testTarget(
            name: "YueClipboardPluginTests",
            dependencies: ["YueClipboardPlugin"],
            path: "ios/Tests/YueClipboardPluginTests")
    ]
)