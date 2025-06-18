# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Capacitor plugin called "yue-flashlight" that provides flashlight control functionality for mobile apps. The plugin allows turning the device's flashlight on/off, toggling its state, and checking availability/status.

## Key Commands

### Build and Development
- `npm run build` - Build the plugin web assets and generate API documentation
- `npm run clean` - Remove dist directory before build
- `npm run watch` - Watch TypeScript files for changes during development
- `npm run docgen` - Generate plugin API documentation using @capacitor/docgen

### Verification and Testing
- `npm run verify` - Build and validate web and native projects for all platforms
- `npm run verify:ios` - Build iOS native code using xcodebuild
- `npm run verify:android` - Build and test Android native code using Gradle
- `npm run verify:web` - Build web assets only

### Code Quality
- `npm run lint` - Run ESLint, Prettier, and SwiftLint checks
- `npm run fmt` - Auto-format code with ESLint, Prettier, and SwiftLint
- `npm run eslint` - Run ESLint on TypeScript files
- `npm run prettier` - Run Prettier on CSS, HTML, TS, JS, and Java files
- `npm run swiftlint` - Run SwiftLint on Swift files

### Publishing
- `npm publish` - Publish the plugin (runs prepublishOnly hook automatically)

## Architecture

### Core Structure
- **TypeScript API** (`src/definitions.ts`): Defines the plugin interface with methods like turnOn, turnOff, toggle, isAvailable, isOn
- **Web Implementation** (`src/web.ts`): Web fallback implementation
- **Android Implementation** (`android/src/main/java/xiuyue/tech/plugins/flashlight/`): Native Android code using Camera2 API
- **iOS Implementation** (`ios/Sources/YueFlashlightPlugin/`): Native iOS code using AVFoundation

### Build Process
1. TypeScript compiles to ESM in `dist/esm/`
2. Rollup bundles into single files: `dist/plugin.js` (IIFE) and `dist/plugin.cjs.js` (CommonJS)
3. Documentation auto-generated from JSDoc comments in definitions.ts

### Platform-Specific Notes
- **Android**: Requires CAMERA permission, supports intensity parameter (0.0-1.0)
- **iOS**: Uses AVCaptureDevice for torch control, intensity not supported in current implementation
- **Web**: Provides fallback/mock implementation

### Native Code Structure
- Android plugin extends Capacitor's Plugin class with @CapacitorPlugin annotation
- iOS plugin implements CAPBridgedPlugin protocol with method definitions
- Both platforms include proper error handling with custom exception types

## Development Workflow

1. Make changes to TypeScript definitions in `src/definitions.ts`
2. Implement web fallback in `src/web.ts`
3. Update native implementations in `android/` and `ios/` directories
4. Run `npm run build` to compile and generate docs
5. Use `npm run verify` to test all platforms
6. Run `npm run lint` before committing changes