# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### [0.0.2](https://github.com/ThomasFourties/sc-planner/compare/v1.2.0...v0.0.2) (2025-06-11)


### 🔨 Chores

* add package.json for project setup and configuration ([fce1e6f](https://github.com/ThomasFourties/sc-planner/commit/fce1e6f1cebdf899614a418956f93ea5d0742900))


### ♻️ Code Refactoring

* **client:** improve navigation and sidebar layout ([70ee4ac](https://github.com/ThomasFourties/sc-planner/commit/70ee4ac594503f6fb994c9f137ed39b24d97a9bf))


### 🐛 Bug Fixes

* **client:** resolve authentication persistence on page refresh - Add auth-init.client.ts plugin to properly initialize auth state from localStorage - Update auth middleware to wait for initialization before checking auth status - Update guest middleware with same initialization logic - Remove duplicate auth initialization from app.vue - Improve register form with real-time code validation and role detection - Remove hardcoded role system from server in favor of dynamic role assignment ([30c03ac](https://github.com/ThomasFourties/sc-planner/commit/30c03ac15a28d1d6806456ba0b1a61c4299158df))
* **server:** update user role in seed and modify auth response messages ([919345c](https://github.com/ThomasFourties/sc-planner/commit/919345c78f65689954114a8febf8a6377576af10))


### ✨ Features

* **ci:** add GitHub Actions workflow for staging ([070d53e](https://github.com/ThomasFourties/sc-planner/commit/070d53e165b82e31c01609c508834bac9aed7814))
* **client:** add authentication pages - Add login page with form validation and UI - Add registration page with complete user signup flow - Add forgot password page with recovery functionality - Implement responsive design for all auth pages ([ae26e43](https://github.com/ThomasFourties/sc-planner/commit/ae26e430fab37951568ce1090cbfc0875e945a40))
* **client:** add new user role display and remove users page ([e5270c4](https://github.com/ThomasFourties/sc-planner/commit/e5270c4e2641b2222e6454cfb81a98561b344875))
* **client:** implement authentication state management - Add Pinia auth store with login/logout/register actions - Add auth composables for reusable authentication logic - Add auth middleware for protecting routes - Add guest middleware for redirecting authenticated users - Add auth initialization plugin for SSR/client hydration ([ac22e28](https://github.com/ThomasFourties/sc-planner/commit/ac22e283952d5174138d8f096046ce5024ab5ffc))
* **client:** update base components and sections - Enhance MainContent, SearchBar and Sidebar components - Add new HeaderLog component for authentication UI - Restructure Hero component location - Improve component organization and auth integration ([077d4dc](https://github.com/ThomasFourties/sc-planner/commit/077d4dc6184a553789dc659a95d8a68773a55858))
* **client:** update design system and styles - Enhance base styles with new auth-related styling - Update typography and color variables - Add improved button components styling - Add new icons for UI components - Refine overall visual consistency ([e584561](https://github.com/ThomasFourties/sc-planner/commit/e5845614ec8f37bed309bbdb1159ce3fce4c2a6e))
* **client:** update existing pages for authentication integration - Update home page with auth-aware navigation and content - Enhance dashboard with authentication guards and user context - Update users page with proper auth middleware protection - Improve overall user experience with auth state ([ec21240](https://github.com/ThomasFourties/sc-planner/commit/ec2124045c2d21a33a06d67c2093e2a8a5788492))
* **client:** update Nuxt configuration and app structure - Update Nuxt config with auth-related modules and settings - Enhance app.vue with authentication layout integration - Configure SSR settings for auth functionality - Add runtime configuration for API endpoints ([f58b871](https://github.com/ThomasFourties/sc-planner/commit/f58b871ca33bb79fbe3f1fb5cac1834a2a71ec63))
* **server:** implement authentication system - Add auth module with JWT authentication - Add TypeORM configuration for database - Add database migrations for auth tables - Update app module and main server configuration ([1f1b9a7](https://github.com/ThomasFourties/sc-planner/commit/1f1b9a77ef7979e5833ce17015376bceaf3b29c4))
* **server:** update user entity and services for authentication - Update user entity with auth-related fields (password, tokens, etc.) - Enhance user DTO with validation and auth properties - Update user service with auth methods and password handling - Update user controller with auth endpoints - Update user seeds for development data ([0b3beaa](https://github.com/ThomasFourties/sc-planner/commit/0b3beaa95ad222bc413a1a2cbc209fbd33a3aad0))
* update dependencies and environment configuration - Add authentication-related dependencies to both client and server - Update package.json files with new libraries for auth implementation - Update .env.example with auth configuration variables ([394bf15](https://github.com/ThomasFourties/sc-planner/commit/394bf15f90246dd59cbb76360814158ed2b90ebb))

## 1.1.0 (2025-06-08)


### ✨ Features

* add version synchronization scripts ([2b2d338](https://github.com/ThomasFourties/sc-planner/commit/2b2d338ffcac6919abe55d4eae1e4ce33c7f3e5b))


### 👷 CI/CD

* add automated changelog workflow ([7538c87](https://github.com/ThomasFourties/sc-planner/commit/7538c87869d8730dab572dc84a7ebd78c74149fd))


### 📚 Documentation

* add changelog system documentation ([cd91d63](https://github.com/ThomasFourties/sc-planner/commit/cd91d63a23999e7936ca38cb1966e4e76bba6810))


### 🐛 Bug Fixes

* correct indentation in changelog workflow ([f813bb0](https://github.com/ThomasFourties/sc-planner/commit/f813bb0fcf8f86023a721422ba683410add1c758))


### 🔨 Chores

* add changelog configuration files ([1d4c7ed](https://github.com/ThomasFourties/sc-planner/commit/1d4c7ed38bc2d6dfdc9898816c92bf46ae32c0b2))
* fix indentation in changelog workflow ([528429e](https://github.com/ThomasFourties/sc-planner/commit/528429e0b27e9946fa52a03d406e053f6470f211))
* fix indentation in changelog workflow ([4c04e5b](https://github.com/ThomasFourties/sc-planner/commit/4c04e5bd67d976dbe3b6c57097fc8f3e23e4c8ef))
* fix indentation in changelog workflow ([c5f1db4](https://github.com/ThomasFourties/sc-planner/commit/c5f1db4bbc1a0d1126c651ab6a87d2499bc04af2))
* fix indentation in changelog workflow ([ae4f4b6](https://github.com/ThomasFourties/sc-planner/commit/ae4f4b6478a096b9a1030bc1e3547bb72d4c6a2a))
* fix indentation in changelog workflow ([83da015](https://github.com/ThomasFourties/sc-planner/commit/83da0155bcaadd2e8c3f5bc7f84df96df370cdfc))
* fix indentation in changelog workflow ([6c5c4d9](https://github.com/ThomasFourties/sc-planner/commit/6c5c4d9321def97405f16d6362a0e1804de0f68d))
* fix indentation in changelog workflow ([737b847](https://github.com/ThomasFourties/sc-planner/commit/737b847ed0b49301c653a682f1e3e231ef20a96d))
* fix indentation in changelog workflow ([6a52daf](https://github.com/ThomasFourties/sc-planner/commit/6a52daf99c33ac44e36a152932f011e7e606bad5))
* fix indentation in changelog workflow ([079a732](https://github.com/ThomasFourties/sc-planner/commit/079a732021f5225ae0d3a0afe1227372d03c1c8c))
* update project configuration ([63cc891](https://github.com/ThomasFourties/sc-planner/commit/63cc8916a8167c1e59c381ac76e8602f15e85853))
* update project configuration ([60b00cb](https://github.com/ThomasFourties/sc-planner/commit/60b00cb51cf5fb6d037fc5521bca4884f76c76ef))

## [0.0.1] - 2025-04-29

### Added
- Initial project setup with Nuxt.js frontend and NestJS backend
- Docker configuration for development and production environments
- PostgreSQL database integration
- Project templates and structure
- Application logo and icons
- Docker image configuration and deployment setup

### Changed
- Updated project dependencies
- Renamed application and Docker images
- Improved Docker compose configuration

### Technical
- First commit and project initialization
- Docker images optimization
- Template structure implementation
- Production deployment configuration

---

*This changelog is automatically generated using [Conventional Commits](https://conventionalcommits.org/)* 