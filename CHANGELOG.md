# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.7](https://github.com/ThomasFourties/sc-planner/compare/v0.2.6...v0.2.7) (2025-06-15)


### ✨ Features

* add script to automate GitHub release creation ([36099de](https://github.com/ThomasFourties/sc-planner/commit/36099de901ec6ee15871d6051cb6caf2d3c499ec))


### 🐛 Bug Fixes

* **release:** add --skip-commit flag to standard-version command ([159d531](https://github.com/ThomasFourties/sc-planner/commit/159d53153994082e6d3b2eb3f7b5f693f2abdc6a))
* **release:** update standard-version command to include --dry-run and --skip-tag options ([07f4631](https://github.com/ThomasFourties/sc-planner/commit/07f4631833e6118ad64011993943535f708b3a54))


### ♻️ Refactoring

* **release:** simplify standard-version command by removing git operations ([0c96c4e](https://github.com/ThomasFourties/sc-planner/commit/0c96c4e3b02b7a4f41147344373413e3d36584db))


### 🛠️ Chore

* add @octokit/rest as a dev dependency ([6d3c521](https://github.com/ThomasFourties/sc-planner/commit/6d3c52106dad7c86b82d0c3b82371f522f1e6787))
* **release:** 0.2.7 ([780b79f](https://github.com/ThomasFourties/sc-planner/commit/780b79f3ff95f259596fbe6fe72ec73bfcb30762))
* **release:** enhance release script to manage git operations manually ([36f7f74](https://github.com/ThomasFourties/sc-planner/commit/36f7f74c7e06080297f5dfea398c4dff9354ec35))

### [0.2.7](https://github.com/ThomasFourties/sc-planner/compare/v0.2.6...v0.2.7) (2025-06-15)

### [0.2.6](https://github.com/ThomasFourties/sc-planner/compare/v0.2.4...v0.2.6) (2025-06-15)


### 🛠️ Chore

* **release:** update version to 0.2.6 for client and server package.json files ([62dbacb](https://github.com/ThomasFourties/sc-planner/commit/62dbacb36f73e6b89042481a6e099137f4c98c65))

### [0.2.4](https://github.com/ThomasFourties/sc-planner/compare/v0.2.3...v0.2.4) (2025-06-15)


### 🛠️ Chore

* **release:** update version to 0.2.3 for client and server package.json files ([339922f](https://github.com/ThomasFourties/sc-planner/commit/339922f9252dd064221b737600cce6cd4fcb6ead))

### [0.2.3](https://github.com/ThomasFourties/sc-planner/compare/v0.2.2...v0.2.3) (2025-06-15)


### 🛠️ Chore

* **release:** streamline release process by removing git commit and tag commands ([81a3534](https://github.com/ThomasFourties/sc-planner/commit/81a35344552d103fa019c38d6f69bfe0fa7da18b))

### [0.2.2](https://github.com/ThomasFourties/sc-planner/compare/v0.2.1...v0.2.2) (2025-06-15)


### 🛠️ Chore

* **release:** 0.2.0 ([3a05fea](https://github.com/ThomasFourties/sc-planner/commit/3a05feaf7340701826296cec911fda66e4dfd7b4))
* **release:** synchronize versioning across client and server package.json files ([9dd861b](https://github.com/ThomasFourties/sc-planner/commit/9dd861bd3c09b249cc7cf91326e7138a70c54b4c))

### [0.2.1](https://github.com/ThomasFourties/sc-planner/compare/v0.2.0...v0.2.1) (2025-06-15)


### 🐛 Bug Fixes

* remove empty section for version 0.2.0 in CHANGELOG ([143b14d](https://github.com/ThomasFourties/sc-planner/commit/143b14deb65dd70568f7df133a9ab5bef9a8924f))

## [0.2.0](https://github.com/ThomasFourties/sc-planner/compare/v0.1.0...v0.2.0) (2025-06-15)


### ✨ Features

* add versioning configuration and release scripts ([82dcffe](https://github.com/ThomasFourties/sc-planner/commit/82dcffee2d7f9a20fc85bad8dbdfeef99c4f4c42))


### 🛠️ Chore

* **release:** 0.2.0 ([18ce971](https://github.com/ThomasFourties/sc-planner/commit/18ce9711dfc0f95dbec3b13ca1f6a35406df7e8b))
* **release:** bump version to 0.2.0 for client and server ([36428ad](https://github.com/ThomasFourties/sc-planner/commit/36428ad6a0a2a535b5d12a66809d028645e1ad98))
* update CHANGELOG to format entries as bullet points ([ff6b6ad](https://github.com/ThomasFourties/sc-planner/commit/ff6b6ad26ecd38f42d06d88d9953d9bf9b25334b))


## [0.1.0](https://github.com/ThomasFourties/sc-planner/compare/v1.0.0...v0.1.0) (2025-06-15)


### ✨ Features

* ✨ feat(auth): add JWT-based login and registration system
* ✨ feat(auth): implement password reset with email token
* ✨ feat: add health check endpoint for deployment monitoring
* ✨ feat: integrate Swagger UI for API documentation

### 👷 CI/CD

* 👷 ci: add GitHub Actions workflow for automatic staging deployment
* 👷 ci: add production deployment workflow with tagging

### 📚 Documentation

* 📚 docs: add setup instructions for local development
* 📚 docs: document authentication flows and endpoints

### 🛠️ Chore

* 🔨 chore: add changelog generation workflow with standard-version
* 🔨 chore: configure commit linting and release tagging