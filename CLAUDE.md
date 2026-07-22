# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IACUBUS is a cross-platform mobile application (iOS/Android) built with Ionic/Angular that integrates with the ILIAS learning management system. The app enables offline access to course materials and personal news. It uses a modular architecture with TypeORM for database management and Cordova for platform compilation.

## Setup & Prerequisites

**Node & Build Tools:**
- Node 18.20+
- Java 11 (for Android builds)
- Gradle 8.14 (for Android)

**Required API Keys:**
- MapBox API key (for location features) — add to `.env` file

**Platform-Specific Setup:**
- **iOS:** Xcode + `ios-sim` + `ios-deploy`
- **Android:** Android Studio with SDK configured, `$ANDROID_HOME` set

**Initial Setup:**
```bash
npm install
npm run setbrand -- --brand="IACUBUS"
npx ionic cordova prepare ios
npx ionic cordova prepare android
```

## Common Commands

### Development & Testing
- **Linting:** `npm run lint` — checks TypeScript style with tslint
- **Unit tests (watch mode):** `npm run test` — runs Karma/Jasmine tests, rebuilds on changes
- **Unit tests (single run):** `npm run test:ci` — runs tests once, used by CI
- **Safari tests:** `npm run test:safari` — runs tests in Safari browser
- **Test pre-hook:** `npm run ionic:build:before` — required before running tests

### Building & Deployment
- **iOS release build:** `npm run build:release:ios` — produces signed release for App Store
- **Android release build:** `npm run build:release:android` — produces release APK for Play Store
- **Branding:** `npm run setbrand -- --brand="[BRAND_NAME]"` — switches app branding (icons, assets, config)

### Build Hooks
- **Ionic build hook:** `npm run ionic:build:before` — pre-processes assets, generates config
- **Ionic serve hook:** `npm run ionic:serve:before` — pre-processes for dev server

## Architecture & Structure

### Directory Layout
```
src/app/
  ├── pages/           # Route pages (tabs, course detail, etc.)
  ├── components/      # Reusable UI components
  ├── providers/       # Services (data, HTTP, auth, network)
  │   ├── ilias/       # ILIAS REST API integration
  │   ├── learnplace/  # LearnPlace plugin integration
  │   ├── repository/  # Database access layer
  │   └── handlers/    # Response/error handlers
  ├── entity/          # TypeORM database entities (SQLite models)
  ├── actions/         # Business logic actions (e.g., OpenObjectInILIASAction)
  ├── models/          # Data models (distinct from entities)
  ├── presenters/      # Data presentation/transformation
  ├── pipes/           # Angular pipes for templates
  ├── util/            # Utility functions
  ├── config/          # Configuration loading
  ├── migrations/      # Database migrations
  └── theme/           # SCSS variables/mixins

branding/
  ├── common/
  │   ├── config/      # server.config.json.template (ILIAS endpoints)
  │   ├── i18n/        # Base translation files (JSON)
  │   ├── scormplayer/ # SCORM player assets
  │   └── resources/   # Common images/icons
  └── brands/          # Brand-specific configs & assets
      └── [BRAND]/
          ├── config.json      # Brand metadata (app name, etc.)
          ├── assets/          # Brand-specific images/styles
          └── resources/       # Brand-specific icons/splash
```

### Key Architectural Patterns

**Providers (Services):**
- Handle business logic, data fetching, and external integrations
- Use dependency injection throughout
- Example: `IliasRestProvider` wraps ILIAS API calls, `AuthenticationProvider` manages login

**Entities:**
- TypeORM entities define SQLite database schema
- Located in `src/app/entity/`
- Include relationships and decorators for database mapping

**Actions:**
- Encapsulate high-level user actions (e.g., "open a course in ILIAS")
- Implement navigation, side effects, and analytics
- Injected as factories into components

**Repository Pattern:**
- `RepositoryAPI` provides type-safe database queries
- `RepositoryUser` manages user-specific data
- Located in `src/app/providers/repository/`

### Branding System

The app supports multi-tenant branding. The `set_brand.js` script:
- Copies brand-specific assets to `src/assets`
- Generates language files by merging `branding/common/i18n` with brand-specific translations
- Updates `config.xml` with brand metadata
- Generates `src/assets/config.json` with ILIAS server endpoints from `server.config.json`

To add a new brand:
1. Create folder in `branding/brands/[BRAND_NAME]/`
2. Add `config.json` with brand metadata
3. Add `assets/` folder with icons and build.json
4. Run `npm run setbrand -- --brand="[BRAND_NAME]"`

## Testing

**Unit Tests:**
- Jasmine framework, Karma runner
- Test files use `.spec.ts` suffix
- Configured in `src/karma.conf.js` and `src/tsconfig.spec.json`
- Run tests with watch during development: `npm run test`
- Note: Many old tests may fail due to outdated code

**Test Tips:**
- Run a specific test file: `ng test --include="**/path/to/file.spec.ts"`
- Coverage reports generated in `coverage/` directory
- Tests must run through `npm run ionic:build:before` hook first

## Important Configuration Files

- **package.json:** Defines all dependencies, scripts, and Cordova plugin config
- **config.xml:** Cordova app config (app name, permissions, plugins) — updated by `setbrand` script
- **angular.json:** Angular CLI build and test configuration
- **.env:** Environment variables (MapBox API key)
- **branding/common/config/server.config.json:** ILIAS server endpoints for all brands
- **build.json:** iOS release build configuration (certificates, provisioning profiles)

## Debugging & Troubleshooting

**Known Issues:**
- Zip traversal security error in Android builds (see README.md Known errors section) — requires manual patching in `platforms/android/app/src/main/java/org/apache/cordova/Zip.java`

**Memory Issues:**
- Release builds use `NODE_OPTIONS=--max_old_space_size=4096` to avoid memory exhaustion

**Offline-First Architecture:**
- SQLite database enables offline access
- Sync logic in providers handles background data updates
