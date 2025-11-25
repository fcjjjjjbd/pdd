# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a uni-app cross-platform application called "专一app挣钱" (Specialized App for Earning) that supports multiple platforms including H5, WeChat Mini Program, App (Android/iOS), and other mini-programs. The app appears to be a service marketplace connecting users with service providers (师傅) for various tasks.

## Development Commands

Since this is a uni-app project using pnpm as the package manager:

```bash
# Install dependencies
pnpm install

# Development - run in H5 mode
pnpm dev:h5

# Development - run in WeChat mini program mode
pnpm dev:mp-weixin

# Development - run in app mode
pnpm dev:app

# Build for different platforms
pnpm build:h5
pnpm build:mp-weixin
pnpm build:app

# Lint code (if configured)
pnpm lint
```

## Architecture

### Framework and Technology Stack
- **uni-app**: Cross-platform development framework
- **Vue 3**: Frontend framework with Composition API
- **Pinia**: State management with persistence
- **uniCloud**: Backend cloud services (Aliyun)
- **Vite**: Build tool
- **SCSS**: CSS preprocessor

### Project Structure
```
├── pages/              # Main pages (home, detail, order, user)
├── pages_fen/          # Sub-package: open-source tech content
├── pages_fena/         # Sub-package: recycling, product management
├── uni_modules/        # uni-app modules (uni-id-pages, uni-pay)
├── stores/             # Pinia stores for state management
├── utils/              # Utility functions and configuration
├── common/             # Common styles and shared code
├── components/         # Reusable Vue components
├── static/             # Static assets
├── assets/             # Project assets (icons, fonts)
└── uniCloud-aliyun/    # Cloud functions and database
```

### Key Features
- **Service Marketplace**: Users can post orders, service providers can accept orders
- **User Authentication**: Complete auth system with uni-id-pages
- **Multi-platform Support**: H5, WeChat mini-program, native apps
- **Payment Integration**: uni-pay for payment processing
- **Geographic Services**: Location-based services
- **Product Management**: Product listings and management
- **Open Source Content**: Technical articles and resources

### State Management
Uses Pinia with persistence for:
- `user.js`: User authentication and profile management
- `location.js`: Geographic location services
- `order.js`: Order management
- `dsmax.js`: Additional state management

### Page Architecture
- **Main Package**: Core pages (navigation, detail, login, self-center)
- **Sub-packages**: Lazy-loaded for performance
  - `pages_fen`: Open-source content and admin functions
  - `pages_fena`: Product management and recycling services
  - `uni_modules/uni-pay/pages`: Payment flow pages

### Authentication Flow
- Uses uni-id-pages for complete authentication system
- Supports multiple login methods: password, SMS, WeChat
- Session management with uniCloud
- Protected routes configured in pages.json

### Key Configuration Files
- `manifest.json`: Platform-specific configurations, permissions, and settings
- `pages.json`: Page routing, navigation, and sub-package configuration
- `vite.config.js`: Build configuration with auto-imports
- `uni.scss`: Global SCSS styles

## Development Notes

### uni-app Specific Considerations
- Use uni-app APIs instead of web APIs for cross-platform compatibility
- Conditional compilation for platform-specific code (`#ifdef`, `#ifndef`)
- Follow uni-app naming conventions for pages and components

### State Persistence
- User state persists across app restarts using uni storage APIs
- Important for maintaining login state and user preferences

### Cloud Integration
- Uses uniCloud for backend services
- Database operations through uniCloud.database()
- Cloud functions imported via uniCloud.importObject()

### Performance Optimization
- Sub-packages configured to reduce initial load time
- Tree shaking disabled in H5 build (see manifest.json)
- Auto-imports configured for Vue and uni-app APIs

### Multi-platform Compatibility
- H5 deployment uses hash routing with base path `/pddclent/`
- Different configurations for WeChat mini-program and native apps
- Platform-specific permissions and features configured in manifest.json