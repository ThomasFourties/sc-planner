# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.1.0 (2025-06-15)


### 👷 CI/CD

* add automated changelog workflow ([7538c87](https://github.com/ThomasFourties/sc-planner/commit/7538c87869d8730dab572dc84a7ebd78c74149fd))


### 📚 Documentation

* add changelog system documentation ([cd91d63](https://github.com/ThomasFourties/sc-planner/commit/cd91d63a23999e7936ca38cb1966e4e76bba6810))


### 🐛 Bug Fixes

* **ci:** correct YAML indentation in deploy-staging workflow ([78478c5](https://github.com/ThomasFourties/sc-planner/commit/78478c5ccca7bf1f119e2f895b32bb83b4f9ba33))
* **ci:** update workflows ([63b39de](https://github.com/ThomasFourties/sc-planner/commit/63b39de7c33958ac832cb51d6e9c723688a4f922))
* **client:** resolve authentication persistence on page refresh - Add auth-init.client.ts plugin to properly initialize auth state from localStorage - Update auth middleware to wait for initialization before checking auth status - Update guest middleware with same initialization logic - Remove duplicate auth initialization from app.vue - Improve register form with real-time code validation and role detection - Remove hardcoded role system from server in favor of dynamic role assignment ([30c03ac](https://github.com/ThomasFourties/sc-planner/commit/30c03ac15a28d1d6806456ba0b1a61c4299158df))
* correct indentation in changelog workflow ([f813bb0](https://github.com/ThomasFourties/sc-planner/commit/f813bb0fcf8f86023a721422ba683410add1c758))
* correct indentation in deploy-prod workflow for consistency ([b758922](https://github.com/ThomasFourties/sc-planner/commit/b75892269d4a03655cedd3812090a25a420a938d))
* enhance deployment workflows and clean up code ([246c43c](https://github.com/ThomasFourties/sc-planner/commit/246c43c8860b88e5dc470112c0b3b8028a6a989a))
* optimize Dockerfile and deployment workflow ([9ef9420](https://github.com/ThomasFourties/sc-planner/commit/9ef9420e4c9fb15a01cfcb8dd8972a60d884dd2e))
* remove Nginx service from Docker Compose and update client Dockerfile to use new nginx.conf ([86ce1f3](https://github.com/ThomasFourties/sc-planner/commit/86ce1f3a68b0d2d44f912064d9829f33a1538cd5))
* remove redundant API_URL environment variable ([d4ef116](https://github.com/ThomasFourties/sc-planner/commit/d4ef116d7af52b64964e5ae9c00a23185ff2fa4d))
* remove unused password reset fields from AuthService ([c761e32](https://github.com/ThomasFourties/sc-planner/commit/c761e3246bc70f49b33c510d8b5b02efb5c55483))
* separate npm installation steps in Dockerfiles for client and server ([5a7013f](https://github.com/ThomasFourties/sc-planner/commit/5a7013f5fe3d9eb3b033f42b09f90bb41772b2a8))
* **server:** update user role in seed and modify auth response messages ([919345c](https://github.com/ThomasFourties/sc-planner/commit/919345c78f65689954114a8febf8a6377576af10))
* streamline deployment workflows by removing unnecessary options ([e36a3bb](https://github.com/ThomasFourties/sc-planner/commit/e36a3bb4269519ba60406fe219ff3b8646d28b6a))
* update API endpoint configurations to use consistent API_URL across client files ([792c88b](https://github.com/ThomasFourties/sc-planner/commit/792c88b3e5113073ff095a13db0106e6f9d521c8))
* update development Docker Compose command to use production configuration ([2e283ce](https://github.com/ThomasFourties/sc-planner/commit/2e283cefe1c6a822bcd6792b1464d28b923b95e0))
* update Docker Compose configuration to remove server port mapping and specify package manager in package.json ([0f38778](https://github.com/ThomasFourties/sc-planner/commit/0f38778186270bac572da3618193d12a36e19ff3))
* update Docker Compose files for development and production environments ([c412c9d](https://github.com/ThomasFourties/sc-planner/commit/c412c9d06c0c5932ef581d426850461fe99adcb5))
* update Docker configuration ([c380fa9](https://github.com/ThomasFourties/sc-planner/commit/c380fa9e7e7b46fb3b0212534bb689a2908a8660))
* update Docker images to use dynamic tags ([75a9f13](https://github.com/ThomasFourties/sc-planner/commit/75a9f133e5482c8c094f61703628726c3da36168))
* update Dockerfile ([ccc4e4e](https://github.com/ThomasFourties/sc-planner/commit/ccc4e4ee7ce05e2d8870ab8b41ea54b3485fbc59))
* update Dockerfile.dev ([ff6549b](https://github.com/ThomasFourties/sc-planner/commit/ff6549bbde970d768f9243d1066556781b9e48f5))
* update Dockerfiles to use frozen lockfile for consistent dependency installation ([a409109](https://github.com/ThomasFourties/sc-planner/commit/a409109f4308b7f208367395ae021c3f17ac0b08))
* update Nginx configuration in Docker setup to use default.conf and specify container name ([f83d1ca](https://github.com/ThomasFourties/sc-planner/commit/f83d1cac7d8cfa450870b2e14d670b14ad8bae9b))
* update Nginx configuration to proxy API requests to server on port 3001 and disable redirects ([bab5bd7](https://github.com/ThomasFourties/sc-planner/commit/bab5bd791433383f0af8a7544c77101eef3d477d))
* update Nginx configuration to use localhost for API proxy ([a9bcad0](https://github.com/ThomasFourties/sc-planner/commit/a9bcad0a91b8074c01deda8a24e954864324250b))
* update Nuxt configuration to use API_BASE_URL and clean up Nginx settings ([b81fa9e](https://github.com/ThomasFourties/sc-planner/commit/b81fa9ee6176c5c30157fabe4131e675a497736f))
* update server startup logs to use dynamic API_URL for consistency ([fa82317](https://github.com/ThomasFourties/sc-planner/commit/fa8231735ac0e06c9e16c6d0af119e18a431342c))
* update Swagger documentation endpoint to use consistent path ([ce51db5](https://github.com/ThomasFourties/sc-planner/commit/ce51db5d0dbf62fb4aa183aba028e5a0dd5b23e6))


### ✨ Features

* add API proxy configuration to Nginx for server communication ([bd9fd4c](https://github.com/ThomasFourties/sc-planner/commit/bd9fd4cd725baccc747ae63e00770815633370bc))
* add API_URL environment variable to production Docker configuration ([f6f2f49](https://github.com/ThomasFourties/sc-planner/commit/f6f2f49bba47d695d0f565c5055a89c46d492a6c))
* add forgot password ([0a9ce88](https://github.com/ThomasFourties/sc-planner/commit/0a9ce882b2cf5f3d09f15974243e40e7fec3763b))
* add health check module and endpoint, set global API prefix ([00a3800](https://github.com/ThomasFourties/sc-planner/commit/00a3800aff2b11363b453412ab0bf44ab3310f94))
* add migration step to Dockerfile ([5d62eb8](https://github.com/ThomasFourties/sc-planner/commit/5d62eb83587a321f68063f39ba507152f3cfd644))
* add new Nginx location block for Nuxt assets and configure custom 404 error page ([2acbfe0](https://github.com/ThomasFourties/sc-planner/commit/2acbfe0762ddee23492b36d13b9699749523bca6))
* add new production deployment workflow ([1fa874b](https://github.com/ThomasFourties/sc-planner/commit/1fa874bfa07fe6fe1e7f6a6a63a3860e7b209e9f))
* add reset password endpoint and client-side functionality ([1f093a1](https://github.com/ThomasFourties/sc-planner/commit/1f093a1d94ce0dd38169053107834951b831515d))
* add reset token and expiration fields to users table ([aabd163](https://github.com/ThomasFourties/sc-planner/commit/aabd163c0a854d0614fb4ef1ee23ea07d4a7ab5e))
* add version synchronization scripts ([2b2d338](https://github.com/ThomasFourties/sc-planner/commit/2b2d338ffcac6919abe55d4eae1e4ce33c7f3e5b))
* **ci:** add GitHub Actions workflow for staging ([070d53e](https://github.com/ThomasFourties/sc-planner/commit/070d53e165b82e31c01609c508834bac9aed7814))
* **client:** add authentication pages - Add login page with form validation and UI - Add registration page with complete user signup flow - Add forgot password page with recovery functionality - Implement responsive design for all auth pages ([ae26e43](https://github.com/ThomasFourties/sc-planner/commit/ae26e430fab37951568ce1090cbfc0875e945a40))
* **client:** add new user role display and remove users page ([e5270c4](https://github.com/ThomasFourties/sc-planner/commit/e5270c4e2641b2222e6454cfb81a98561b344875))
* **client:** implement authentication state management - Add Pinia auth store with login/logout/register actions - Add auth composables for reusable authentication logic - Add auth middleware for protecting routes - Add guest middleware for redirecting authenticated users - Add auth initialization plugin for SSR/client hydration ([ac22e28](https://github.com/ThomasFourties/sc-planner/commit/ac22e283952d5174138d8f096046ce5024ab5ffc))
* **client:** update base components and sections - Enhance MainContent, SearchBar and Sidebar components - Add new HeaderLog component for authentication UI - Restructure Hero component location - Improve component organization and auth integration ([077d4dc](https://github.com/ThomasFourties/sc-planner/commit/077d4dc6184a553789dc659a95d8a68773a55858))
* **client:** update design system and styles - Enhance base styles with new auth-related styling - Update typography and color variables - Add improved button components styling - Add new icons for UI components - Refine overall visual consistency ([e584561](https://github.com/ThomasFourties/sc-planner/commit/e5845614ec8f37bed309bbdb1159ce3fce4c2a6e))
* **client:** update existing pages for authentication integration - Update home page with auth-aware navigation and content - Enhance dashboard with authentication guards and user context - Update users page with proper auth middleware protection - Improve overall user experience with auth state ([ec21240](https://github.com/ThomasFourties/sc-planner/commit/ec2124045c2d21a33a06d67c2093e2a8a5788492))
* **client:** update Nuxt configuration and app structure - Update Nuxt config with auth-related modules and settings - Enhance app.vue with authentication layout integration - Configure SSR settings for auth functionality - Add runtime configuration for API endpoints ([f58b871](https://github.com/ThomasFourties/sc-planner/commit/f58b871ca33bb79fbe3f1fb5cac1834a2a71ec63))
* enhance form styling and structure ([2e15256](https://github.com/ThomasFourties/sc-planner/commit/2e15256080f0533a06c5033fc2e18460dbdecf10))
* enhance Nginx configuration with CORS support and improved logging ([83b1d18](https://github.com/ThomasFourties/sc-planner/commit/83b1d1800017b674ddae3dd9867f5f6f90c5ee6e))
* implement reset password functionality with user feedback ([90e1a6c](https://github.com/ThomasFourties/sc-planner/commit/90e1a6c528df845ec122c8d36b8ff19f22c9fefd))
* implement user authentication API endpoints and add FormLoader component for registration process ([94c34de](https://github.com/ThomasFourties/sc-planner/commit/94c34ded0364fcdcc1b4aeeb6f92dbb1237ac7aa))
* **server:** implement authentication system - Add auth module with JWT authentication - Add TypeORM configuration for database - Add database migrations for auth tables - Update app module and main server configuration ([1f1b9a7](https://github.com/ThomasFourties/sc-planner/commit/1f1b9a77ef7979e5833ce17015376bceaf3b29c4))
* **server:** update user entity and services for authentication - Update user entity with auth-related fields (password, tokens, etc.) - Enhance user DTO with validation and auth properties - Update user service with auth methods and password handling - Update user controller with auth endpoints - Update user seeds for development data ([0b3beaa](https://github.com/ThomasFourties/sc-planner/commit/0b3beaa95ad222bc413a1a2cbc209fbd33a3aad0))
* update dependencies and environment configuration - Add authentication-related dependencies to both client and server - Update package.json files with new libraries for auth implementation - Update .env.example with auth configuration variables ([394bf15](https://github.com/ThomasFourties/sc-planner/commit/394bf15f90246dd59cbb76360814158ed2b90ebb))


### ♻️ Code Refactoring

* clean up formatting and improve readability in auth and email services ([62d4651](https://github.com/ThomasFourties/sc-planner/commit/62d46513d41ada97c54f20414157cb1412f74bce))
* **client:** improve navigation and sidebar layout ([70ee4ac](https://github.com/ThomasFourties/sc-planner/commit/70ee4ac594503f6fb994c9f137ed39b24d97a9bf))
* remove fake status function from reset-password page ([151076a](https://github.com/ThomasFourties/sc-planner/commit/151076ab4d2afbf5a052b22fe7b429cd412620b3))
* rename user fields to snake_case across the application ([7404c7a](https://github.com/ThomasFourties/sc-planner/commit/7404c7a3d08dcd086bcdd873a05d78767804b883))
* some fixes & remove comments ([b9f58c8](https://github.com/ThomasFourties/sc-planner/commit/b9f58c859fb72ccc44f876bfdf6864d18a5d1159))
* some fixes & remove comments ([1f691c1](https://github.com/ThomasFourties/sc-planner/commit/1f691c1c630d2265eb76ce2a3b83002b4021005d))
* standardize user name fields to use snake_case ([276bb9f](https://github.com/ThomasFourties/sc-planner/commit/276bb9ff56ba4f701ac52e852f1cedcdac8c32ee))
* update changelog workflow for improved release management and version synchronization ([c25675f](https://github.com/ThomasFourties/sc-planner/commit/c25675fd562b93dc4545d759e15bca7500ad99de))


### 🔨 Chores

* add changelog configuration files ([1d4c7ed](https://github.com/ThomasFourties/sc-planner/commit/1d4c7ed38bc2d6dfdc9898816c92bf46ae32c0b2))
* add development configuration ([aca68f7](https://github.com/ThomasFourties/sc-planner/commit/aca68f79b130a19e8a6a6fb6c5c86daa3577b025))
* add master-clone branch to changelog workflow triggers ([8b23bf1](https://github.com/ThomasFourties/sc-planner/commit/8b23bf146dd8dc0e77e40857a6caaa29149e1aa4))
* add package.json for project setup and configuration ([fce1e6f](https://github.com/ThomasFourties/sc-planner/commit/fce1e6f1cebdf899614a418956f93ea5d0742900))
* add production configuration ([155f9b5](https://github.com/ThomasFourties/sc-planner/commit/155f9b59d46b5eee2ee4e327ae5fb9b1f9583109))
* **ci:** update deploy-staging workflow ([835c636](https://github.com/ThomasFourties/sc-planner/commit/835c636ab04aa43dbfb7677cfa277aa4ae89e868))
* clean up environment variable configuration in app module ([6672354](https://github.com/ThomasFourties/sc-planner/commit/6672354bda99b4983792a27d8c6b944a6b51f9c1))
* clear .env.example for better configuration clarity ([0234414](https://github.com/ThomasFourties/sc-planner/commit/0234414437b7e7e3ddd8890982773216a54bdc61))
* fix indentation in changelog workflow ([528429e](https://github.com/ThomasFourties/sc-planner/commit/528429e0b27e9946fa52a03d406e053f6470f211))
* fix indentation in changelog workflow ([4c04e5b](https://github.com/ThomasFourties/sc-planner/commit/4c04e5bd67d976dbe3b6c57097fc8f3e23e4c8ef))
* fix indentation in changelog workflow ([c5f1db4](https://github.com/ThomasFourties/sc-planner/commit/c5f1db4bbc1a0d1126c651ab6a87d2499bc04af2))
* fix indentation in changelog workflow ([ae4f4b6](https://github.com/ThomasFourties/sc-planner/commit/ae4f4b6478a096b9a1030bc1e3547bb72d4c6a2a))
* fix indentation in changelog workflow ([83da015](https://github.com/ThomasFourties/sc-planner/commit/83da0155bcaadd2e8c3f5bc7f84df96df370cdfc))
* fix indentation in changelog workflow ([6c5c4d9](https://github.com/ThomasFourties/sc-planner/commit/6c5c4d9321def97405f16d6362a0e1804de0f68d))
* fix indentation in changelog workflow ([737b847](https://github.com/ThomasFourties/sc-planner/commit/737b847ed0b49301c653a682f1e3e231ef20a96d))
* fix indentation in changelog workflow ([6a52daf](https://github.com/ThomasFourties/sc-planner/commit/6a52daf99c33ac44e36a152932f011e7e606bad5))
* fix indentation in changelog workflow ([079a732](https://github.com/ThomasFourties/sc-planner/commit/079a732021f5225ae0d3a0afe1227372d03c1c8c))
* fix indentation in Git tag retrieval step of deployment workflow ([cd9dde5](https://github.com/ThomasFourties/sc-planner/commit/cd9dde590d65a899c8a101dde3e30c5b9a537d18))
* refine Git tag retrieval in deployment workflow ([85318bb](https://github.com/ThomasFourties/sc-planner/commit/85318bb52c0937b5b9df32fa5797ae7e91de173e))
* **release:** 1.1.0 ([21cbac7](https://github.com/ThomasFourties/sc-planner/commit/21cbac77e4057f7fdbb0da22abf42e8b7b4c1094))
* remove deployment verification step from production and staging workflows ([66035f4](https://github.com/ThomasFourties/sc-planner/commit/66035f446d00118c99085b00ff6f152fd16f9beb))
* remove unused '@nuxtjs/proxy' dependency and clean up pnpm-lock.yaml ([a0fe3a7](https://github.com/ThomasFourties/sc-planner/commit/a0fe3a772bb6bc9d99c0049700de627bf0956914))
* reorganize changelog workflow to install pnpm before setting up Node.js ([f9b87dc](https://github.com/ThomasFourties/sc-planner/commit/f9b87dc988e38ac054d7639305ee91a73ded4dc8))
* update changelog workflow to push changes to the current branch ([a5e3e68](https://github.com/ThomasFourties/sc-planner/commit/a5e3e68cd6c3b4309253b2a6c05210f359e1b9b5))
* update changelog workflow to use pnpm ([d179659](https://github.com/ThomasFourties/sc-planner/commit/d1796590218dc63069505900c6f11055ab6ac7f8))
* update deployment workflow names for clarity and improve staging image cleanup script ([d9b21d9](https://github.com/ThomasFourties/sc-planner/commit/d9b21d929ab51953bead8ff6826a17ade3bb8fac))
* update deployment workflows to improve tagging and add cleanup for staging images ([ddccc0c](https://github.com/ThomasFourties/sc-planner/commit/ddccc0ca2693bfa45a20ba81bf73fc071ae42497))
* update Node.js version and caching method in changelog workflow ([5e6b2d5](https://github.com/ThomasFourties/sc-planner/commit/5e6b2d582a48508bf75c75177423ef4bc0515dff))
* update Node.js version to 20.18.2 and install pnpm in changelog workflow ([fecbde6](https://github.com/ThomasFourties/sc-planner/commit/fecbde6440f9fe1db526e6f87bef9e54ec61602d))
* update pnpm version to 10.11.0 in changelog workflow ([2f94998](https://github.com/ThomasFourties/sc-planner/commit/2f949987a45d6bac670f50087f89dad63496dbad))
* update project configuration ([63cc891](https://github.com/ThomasFourties/sc-planner/commit/63cc8916a8167c1e59c381ac76e8602f15e85853))
* update project configuration ([60b00cb](https://github.com/ThomasFourties/sc-planner/commit/60b00cb51cf5fb6d037fc5521bca4884f76c76ef))
* update versioning commands to use pnpm ([e8f296f](https://github.com/ThomasFourties/sc-planner/commit/e8f296f175f9f29a68799b763fee5d3b654cd0f1))

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