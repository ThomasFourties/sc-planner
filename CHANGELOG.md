# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-06-15

### 🐛 Bug Fixes

- fix: test changelog fix entry
- feat(client): add dummy file for changelog


## [0.1.0] - 2025-06-15

### 🐛 Bug Fixes

- chore: mise à jour du script de release
- chore: mise à jour du script de release
- chore: mise à jour du script de release
- chore: préparation de la release
- chore(release): 0.0.1
- chore: préparation de la release
- chore: remove obsolete test files for client and server
- feat(release): implement release script and update package.json commands
- chore: update commit message guidelines and clean up workflows
- chore: add git commit instructions and update changelog workflow
- chore: update package versions to 0.0.0 for main, client, and server
- chore: remove obsolete test files for bugfix and changelog
- fix(server): add dummy fix for changelog
- feat(client): add dummy file for changelog
- Merge branch 'dev'
- fix: test changelog fix entry
- feat: add changelog test file


## [0.0.1] - 2025-06-15


### 👷 CI/CD

* add automated changelog workflow ([7538c87](https://github.com/ThomasFourties/sc-planner/commit/7538c87869d8730dab572dc84a7ebd78c74149fd))


### 📚 Documentation

* add changelog system documentation ([cd91d63](https://github.com/ThomasFourties/sc-planner/commit/cd91d63a23999e7936ca38cb1966e4e76bba6810))


### ♻️ Code Refactoring

* clean up formatting and improve readability in auth and email services ([62d4651](https://github.com/ThomasFourties/sc-planner/commit/62d46513d41ada97c54f20414157cb1412f74bce))
* improve navigation and sidebar layout ([70ee4ac](https://github.com/ThomasFourties/sc-planner/commit/70ee4ac594503f6fb994c9f137ed39b24d97a9bf))
* remove fake status function from reset-password page ([151076a](https://github.com/ThomasFourties/sc-planner/commit/151076ab4d2afbf5a052b22fe7b429cd412620b3))
* rename user fields to snake_case across the application ([7404c7a](https://github.com/ThomasFourties/sc-planner/commit/7404c7a3d08dcd086bcdd873a05d78767804b883))
* some fixes & remove comments ([1f691c1](https://github.com/ThomasFourties/sc-planner/commit/1f691c1c630d2265eb76ce2a3b83002b4021005d))
* standardize user name fields to use snake_case ([276bb9f](https://github.com/ThomasFourties/sc-planner/commit/276bb9ff56ba4f701ac52e852f1cedcdac8c32ee))
* update changelog workflow for improved release management and version synchronization ([c25675f](https://github.com/ThomasFourties/sc-planner/commit/c25675fd562b93dc4545d759e15bca7500ad99de))


### ✨ Features

* add API proxy configuration to Nginx for server communication ([7b7f933](https://github.com/ThomasFourties/sc-planner/commit/7b7f93329a2b049d5b5594d9047b16f895e10ddf))
* add API_URL environment variable to production Docker configuration ([f6f2f49](https://github.com/ThomasFourties/sc-planner/commit/f6f2f49bba47d695d0f565c5055a89c46d492a6c))
* add forgot password ([0a9ce88](https://github.com/ThomasFourties/sc-planner/commit/0a9ce882b2cf5f3d09f15974243e40e7fec3763b))
* add health check module and endpoint, set global API prefix ([00a3800](https://github.com/ThomasFourties/sc-planner/commit/00a3800aff2b11363b453412ab0bf44ab3310f94))
* add migration step to Dockerfile ([5d62eb8](https://github.com/ThomasFourties/sc-planner/commit/5d62eb83587a321f68063f39ba507152f3cfd644))
* add new Nginx location block for Nuxt assets and configure custom 404 error page ([bb9bb3a](https://github.com/ThomasFourties/sc-planner/commit/bb9bb3a1a398bfb8eeae197acf0f90539d836444))
* add new production deployment workflow ([1fa874b](https://github.com/ThomasFourties/sc-planner/commit/1fa874bfa07fe6fe1e7f6a6a63a3860e7b209e9f))
* add reset password endpoint and client-side functionality ([1f093a1](https://github.com/ThomasFourties/sc-planner/commit/1f093a1d94ce0dd38169053107834951b831515d))
* add reset token and expiration fields to users table ([9fd39b2](https://github.com/ThomasFourties/sc-planner/commit/9fd39b2f28e591668fbbbdda659ae739c9aaa40f))
* add test file for changelog ([075af0d](https://github.com/ThomasFourties/sc-planner/commit/075af0d4107251108e4b1af075a37e14bafe603b))
* add version synchronization scripts ([2b2d338](https://github.com/ThomasFourties/sc-planner/commit/2b2d338ffcac6919abe55d4eae1e4ce33c7f3e5b))
* add GitHub Actions workflow for staging ([070d53e](https://github.com/ThomasFourties/sc-planner/commit/070d53e165b82e31c01609c508834bac9aed7814))
* add authentication pages - Add login page with form validation and UI - Add registration page with complete user signup flow - Add forgot password page with recovery functionality - Implement responsive design for all auth pages ([ae26e43](https://github.com/ThomasFourties/sc-planner/commit/ae26e430fab37951568ce1090cbfc0875e945a40))
* add new user role display and remove users page ([e5270c4](https://github.com/ThomasFourties/sc-planner/commit/e5270c4e2641b2222e6454cfb81a98561b344875))
* implement authentication state management - Add Pinia auth store with login/logout/register actions - Add auth composables for reusable authentication logic - Add auth middleware for protecting routes - Add guest middleware for redirecting authenticated users - Add auth initialization plugin for SSR/client hydration ([ac22e28](https://github.com/ThomasFourties/sc-planner/commit/ac22e283952d5174138d8f096046ce5024ab5ffc))
* update base components and sections - Enhance MainContent, SearchBar and Sidebar components - Add new HeaderLog component for authentication UI - Restructure Hero component location - Improve component organization and auth integration ([077d4dc](https://github.com/ThomasFourties/sc-planner/commit/077d4dc6184a553789dc659a95d8a68773a55858))
* update design system and styles - Enhance base styles with new auth-related styling - Update typography and color variables - Add improved button components styling - Add new icons for UI components - Refine overall visual consistency ([e584561](https://github.com/ThomasFourties/sc-planner/commit/e5845614ec8f37bed309bbdb1159ce3fce4c2a6e))
* update existing pages for authentication integration - Update home page with auth-aware navigation and content - Enhance dashboard with authentication guards and user context - Update users page with proper auth middleware protection - Improve overall user experience with auth state ([ec21240](https://github.com/ThomasFourties/sc-planner/commit/ec2124045c2d21a33a06d67c2093e2a8a5788492))
* update Nuxt configuration and app structure - Update Nuxt config with auth-related modules and settings - Enhance app.vue with authentication layout integration - Configure SSR settings for auth functionality - Add runtime configuration for API endpoints ([f58b871](https://github.com/ThomasFourties/sc-planner/commit/f58b871ca33bb79fbe3f1fb5cac1834a2a71ec63))
* enhance form styling and structure ([83a2510](https://github.com/ThomasFourties/sc-planner/commit/83a2510a99bb04208be215d7d9c2094f4624c324))
* enhance Nginx configuration with CORS support and improved logging ([d14c1c8](https://github.com/ThomasFourties/sc-planner/commit/d14c1c82ff4e6f7220e6797374359adc60498c6b))
* implement reset password functionality with user feedback ([d34837b](https://github.com/ThomasFourties/sc-planner/commit/d34837ba3897b1c3a00ea404a8f7658e20bbf69f))
* implement user authentication API endpoints and add FormLoader component for registration process ([9696985](https://github.com/ThomasFourties/sc-planner/commit/969698536c70c31834565c5f089ac3589b410542))
* implement authentication system - Add auth module with JWT authentication - Add TypeORM configuration for database - Add database migrations for auth tables - Update app module and main server configuration ([1f1b9a7](https://github.com/ThomasFourties/sc-planner/commit/1f1b9a77ef7979e5833ce17015376bceaf3b29c4))
* update user entity and services for authentication - Update user entity with auth-related fields (password, tokens, etc.) - Enhance user DTO with validation and auth properties - Update user service with auth methods and password handling - Update user controller with auth endpoints - Update user seeds for development data ([0b3beaa](https://github.com/ThomasFourties/sc-planner/commit/0b3beaa95ad222bc413a1a2cbc209fbd33a3aad0))
* update dependencies and environment configuration - Add authentication-related dependencies to both client and server - Update package.json files with new libraries for auth implementation - Update .env.example with auth configuration variables ([394bf15](https://github.com/ThomasFourties/sc-planner/commit/394bf15f90246dd59cbb76360814158ed2b90ebb))


### 🔨 Chores

* add changelog configuration files ([1d4c7ed](https://github.com/ThomasFourties/sc-planner/commit/1d4c7ed38bc2d6dfdc9898816c92bf46ae32c0b2))
* add development configuration ([aca68f7](https://github.com/ThomasFourties/sc-planner/commit/aca68f79b130a19e8a6a6fb6c5c86daa3577b025))
* add package.json for project setup and configuration ([fce1e6f](https://github.com/ThomasFourties/sc-planner/commit/fce1e6f1cebdf899614a418956f93ea5d0742900))
* add production configuration ([155f9b5](https://github.com/ThomasFourties/sc-planner/commit/155f9b59d46b5eee2ee4e327ae5fb9b1f9583109))
* add push trigger for changelog workflow on master branch ([08b109d](https://github.com/ThomasFourties/sc-planner/commit/08b109d4d7a9515be7baf574764b708f204b5c09))
* clean up environment variable configuration in app module ([194daad](https://github.com/ThomasFourties/sc-planner/commit/194daade2a43cc8204101fd75618a3567b30347a))
* clear .env.example for better configuration clarity ([0234414](https://github.com/ThomasFourties/sc-planner/commit/0234414437b7e7e3ddd8890982773216a54bdc61))
* comment out push trigger for master branch in deployment workflow ([ebb7031](https://github.com/ThomasFourties/sc-planner/commit/ebb7031ba2fbbd6fc256dfd8137de523e8e84c75))
* fix indentation in changelog workflow ([528429e](https://github.com/ThomasFourties/sc-planner/commit/528429e0b27e9946fa52a03d406e053f6470f211))
* fix indentation in Git tag retrieval step of deployment workflow ([c86da97](https://github.com/ThomasFourties/sc-planner/commit/c86da97bd419520a744e55474c16d744e25cd558))
* refine Git tag retrieval in deployment workflow ([6cc1899](https://github.com/ThomasFourties/sc-planner/commit/6cc18992e2a3936af1b5beb75fe32e7c0f0f3d29))
* remove deployment verification step from production and staging workflows ([d8cc5df](https://github.com/ThomasFourties/sc-planner/commit/d8cc5df0cf6d4005d7e9ffeaac4b29925411dd73))
* remove pnpm version specification in changelog workflow ([ee8f88e](https://github.com/ThomasFourties/sc-planner/commit/ee8f88e8035d111f718e238a6a234249dbc7be93))
* remove unused '@nuxtjs/proxy' dependency and clean up pnpm-lock.yaml ([7d3fc83](https://github.com/ThomasFourties/sc-planner/commit/7d3fc837df093a71e09a7704d3701688fa07fc9d))
* update changelog workflow to push changes to the current branch ([a5e3e68](https://github.com/ThomasFourties/sc-planner/commit/a5e3e68cd6c3b4309253b2a6c05210f359e1b9b5))
* update changelog workflow to use 'patch' release type by default ([b5b93ae](https://github.com/ThomasFourties/sc-planner/commit/b5b93aeea89a1de99361a1dddc4fc890d869cb75))
* update changelog workflow to use pnpm ([d179659](https://github.com/ThomasFourties/sc-planner/commit/d1796590218dc63069505900c6f11055ab6ac7f8))
* update deployment workflow names for clarity and improve staging image cleanup script ([d9b21d9](https://github.com/ThomasFourties/sc-planner/commit/d9b21d929ab51953bead8ff6826a17ade3bb8fac))
* update deployment workflows to improve tagging and add cleanup for staging images ([ddccc0c](https://github.com/ThomasFourties/sc-planner/commit/ddccc0ca2693bfa45a20ba81bf73fc071ae42497))
* update Node.js version and caching method in changelog workflow ([5e6b2d5](https://github.com/ThomasFourties/sc-planner/commit/5e6b2d582a48508bf75c75177423ef4bc0515dff))
* update Node.js version to 20.18.2 and install pnpm in changelog workflow ([fecbde6](https://github.com/ThomasFourties/sc-planner/commit/fecbde6440f9fe1db526e6f87bef9e54ec61602d))
* update package versions to 0.0.0 for main, client, and server ([5ae188f](https://github.com/ThomasFourties/sc-planner/commit/5ae188f4d960ea357a09437fb75e26aea3f0231f))
* update pnpm version to 10.11.0 in changelog workflow ([2f94998](https://github.com/ThomasFourties/sc-planner/commit/2f949987a45d6bac670f50087f89dad63496dbad))
* update project configuration ([63cc891](https://github.com/ThomasFourties/sc-planner/commit/63cc8916a8167c1e59c381ac76e8602f15e85853))
* update versioning commands to use pnpm ([e8f296f](https://github.com/ThomasFourties/sc-planner/commit/e8f296f175f9f29a68799b763fee5d3b654cd0f1))


### 🐛 Bug Fixes

* correct YAML indentation in deploy-staging workflow ([78478c5](https://github.com/ThomasFourties/sc-planner/commit/78478c5ccca7bf1f119e2f895b32bb83b4f9ba33))
* update workflows ([63b39de](https://github.com/ThomasFourties/sc-planner/commit/63b39de7c33958ac832cb51d6e9c723688a4f922))
* cleanup CHANGELOG.md file ([af215bd](https://github.com/ThomasFourties/sc-planner/commit/af215bdb5138b0ff9a332f5ffeef7cf331a3633e))
* resolve authentication persistence on page refresh - Add auth-init.client.ts plugin to properly initialize auth state from localStorage - Update auth middleware to wait for initialization before checking auth status - Update guest middleware with same initialization logic - Remove duplicate auth initialization from app.vue - Improve register form with real-time code validation and role detection - Remove hardcoded role system from server in favor of dynamic role assignment ([30c03ac](https://github.com/ThomasFourties/sc-planner/commit/30c03ac15a28d1d6806456ba0b1a61c4299158df))
* correct indentation in changelog workflow ([f813bb0](https://github.com/ThomasFourties/sc-planner/commit/f813bb0fcf8f86023a721422ba683410add1c758))
* correct test logic in dummy file ([0eef77a](https://github.com/ThomasFourties/sc-planner/commit/0eef77a78f2e2e7a818b8ed73824a4e9e5a24135))
* enhance deployment workflows and clean up code ([2470859](https://github.com/ThomasFourties/sc-planner/commit/24708597ffbeea15010979917871ac3332ee53f4))
* improve version synchronization in changelog workflow ([70900f5](https://github.com/ThomasFourties/sc-planner/commit/70900f51ddf4af542a592a135673fbe8c95f2d1a))
* optimize Dockerfile and deployment workflow ([9ef9420](https://github.com/ThomasFourties/sc-planner/commit/9ef9420e4c9fb15a01cfcb8dd8972a60d884dd2e))
* remove Nginx service from Docker Compose and update client Dockerfile to use new nginx.conf ([86ce1f3](https://github.com/ThomasFourties/sc-planner/commit/86ce1f3a68b0d2d44f912064d9829f33a1538cd5))
* remove redundant API_URL environment variable ([d4ef116](https://github.com/ThomasFourties/sc-planner/commit/d4ef116d7af52b64964e5ae9c00a23185ff2fa4d))
* remove unused password reset fields from AuthService ([25d7536](https://github.com/ThomasFourties/sc-planner/commit/25d7536fb1bbdfcf93a0ecb8c20e651efb6a63cc))
* separate npm installation steps in Dockerfiles for client and server ([21317e4](https://github.com/ThomasFourties/sc-planner/commit/21317e4610a382440b3d3732f717f28e82be4369))
* streamline deployment workflows by removing unnecessary options ([2df55f7](https://github.com/ThomasFourties/sc-planner/commit/2df55f7b66e0d1d47d2553a5f4669e253338df6e))
* update API endpoint configurations to use consistent API_URL across client files ([3c58eec](https://github.com/ThomasFourties/sc-planner/commit/3c58eecb0e74d1e3eaee21e73dd4d2410a21c918))
* update development Docker Compose command to use production configuration ([bbbf75f](https://github.com/ThomasFourties/sc-planner/commit/bbbf75f3399698f204a0e35d0cce7f56f4387b13))
* update Docker Compose configuration to remove server port mapping and specify package manager in package.json ([854a7a3](https://github.com/ThomasFourties/sc-planner/commit/854a7a3c7ac80130478cc5a53f945bacba21e48d))
* update Docker configuration ([c380fa9](https://github.com/ThomasFourties/sc-planner/commit/c380fa9e7e7b46fb3b0212534bb689a2908a8660))
* update Docker images to use dynamic tags ([75a9f13](https://github.com/ThomasFourties/sc-planner/commit/75a9f133e5482c8c094f61703628726c3da36168))
* update Dockerfile ([ccc4e4e](https://github.com/ThomasFourties/sc-planner/commit/ccc4e4ee7ce05e2d8870ab8b41ea54b3485fbc59))
* update Dockerfile.dev ([ff6549b](https://github.com/ThomasFourties/sc-planner/commit/ff6549bbde970d768f9243d1066556781b9e48f5))
* update Dockerfiles to use frozen lockfile for consistent dependency installation ([a409109](https://github.com/ThomasFourties/sc-planner/commit/a409109f4308b7f208367395ae021c3f17ac0b08))
* update Nginx configuration to use localhost for API proxy ([a9bcad0](https://github.com/ThomasFourties/sc-planner/commit/a9bcad0a91b8074c01deda8a24e954864324250b))
* update Nuxt configuration to use API_BASE_URL and clean up Nginx settings ([0311f0b](https://github.com/ThomasFourties/sc-planner/commit/0311f0bfcb55122a20def38c0bf971ef50ee49c7))
* update server startup logs to use dynamic API_URL for consistency ([e4147cf](https://github.com/ThomasFourties/sc-planner/commit/e4147cf0837b5628276650c17efdc4adbd3b8727))
* update Swagger documentation endpoint to use consistent path ([822693d](https://github.com/ThomasFourties/sc-planner/commit/822693d8d1dc06f8ee1f23a9539db254213cc8fe))
