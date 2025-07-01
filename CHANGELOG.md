# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.5.0](https://github.com/ThomasFourties/sc-planner/compare/v0.4.0...v0.5.0) (2025-07-01)


### 💅 Styles

* **MainContent:** update background color and border radius for improved aesthetics ([fabaf9a](https://github.com/ThomasFourties/sc-planner/commit/fabaf9a3b84285dc4c80499f229f84cf82dcdaa0))


### 🐛 Bug Fixes

* **nuxt:** update site URL configuration to use environment variable for better flexibility ([15516ba](https://github.com/ThomasFourties/sc-planner/commit/15516ba439731c237edc9ed6c3f93346cb26bad5))
* **package:** update development Docker configuration to use docker-compose.dev.yml ([5c49ad7](https://github.com/ThomasFourties/sc-planner/commit/5c49ad7017caf9ed8db17029fc776a253cc73af9))
* **workflows:** adjust indentation and formatting in Docker image cleanup script ([2a26113](https://github.com/ThomasFourties/sc-planner/commit/2a2611302a6c9b31d096dbe799d1e20590a3c4da))


### 🛠️ Chore

* add comments ([40f45b0](https://github.com/ThomasFourties/sc-planner/commit/40f45b00b921fc8d217eb05809f4f845bf5dff8f))
* add comments for test ([ea1fe52](https://github.com/ThomasFourties/sc-planner/commit/ea1fe5273f002e01f26ebae25b6ec2f3a67ad368))
* **comments:** add placeholder comments ([dd55b3c](https://github.com/ThomasFourties/sc-planner/commit/dd55b3cb805514a53631fe6b7e02550c8e720e99))
* **comments:** remove comments ([93eec24](https://github.com/ThomasFourties/sc-planner/commit/93eec248645d3ddc66d1434b0787be60be496814))
* **dependencies:** update @nuxtjs/sitemap to 7.4.0 and nuxt-gtag to 3.0.3 for improved functionality ([efcb4f1](https://github.com/ThomasFourties/sc-planner/commit/efcb4f112fe70a8b3f89dec38147b39b96f692fe))
* **dependencies:** update conventional-changelog-cli to version 5.0.0 and add pnpm-lock.yaml for improved dependency management ([4aa4ca7](https://github.com/ThomasFourties/sc-planner/commit/4aa4ca7c0ea32086ff203afba782285f7100836f))
* **dependencies:** update various package versions for improved compatibility and performance ([63ca2fb](https://github.com/ThomasFourties/sc-planner/commit/63ca2fb1fc758b5ab12404094dd2527cdda7fe14))
* **docker:** change client port ([9255394](https://github.com/ThomasFourties/sc-planner/commit/9255394c192504cb4e0728e61c9a4766f058a0c7))
* **docker:** remove maintainer label from development compose file ([aba7880](https://github.com/ThomasFourties/sc-planner/commit/aba788075893e9951f4507b2e5a091ed1bee4456))
* **docker:** update client port ([b0caa54](https://github.com/ThomasFourties/sc-planner/commit/b0caa5410f8bf9c6f62a14b624015f961c1b0067))
* **docker:** update Docker images to use 'latest' tag and refine deployment workflow for improved efficiency ([c4c70c3](https://github.com/ThomasFourties/sc-planner/commit/c4c70c3f08d0b822a0770a82c7e613f0a79e2c0d))
* **env:** update .env.example ([b8d0ba2](https://github.com/ThomasFourties/sc-planner/commit/b8d0ba2e471fedb2fbdbc7702e616b740e9da214))
* **package:** remove unused vue-toastification dependency from client package.json ([693de12](https://github.com/ThomasFourties/sc-planner/commit/693de12a4387946bd3ff2c630f74f1ec7c066648))
* **readme:** update API_URL ([9aee819](https://github.com/ThomasFourties/sc-planner/commit/9aee819f942328c6831959fc61a87b880f5ff26c))


### ♻️ Refactoring

* **auth, database, users:** simplify authentication logic, remove task-related components, and enhance user management ([116d55b](https://github.com/ThomasFourties/sc-planner/commit/116d55b6380270434ec2764709d1a111d5c1819b))
* **auth:** streamline authentication flow and remove unused task-related code ([4e442c4](https://github.com/ThomasFourties/sc-planner/commit/4e442c4c7145cd3a3bf4ff997cca532197802403))
* **docker:** standardize database volume naming ([a4c341a](https://github.com/ThomasFourties/sc-planner/commit/a4c341a81ee74873f94f8d44cb93eedcaf887e74))
* **workflows:** staging deployment workflow ([1c355b4](https://github.com/ThomasFourties/sc-planner/commit/1c355b4fddeaf19e0f508fbce63ac86204127958))


### ✨ Features

* **auth, tasks, users:** enhance authentication and task management ([eae41d2](https://github.com/ThomasFourties/sc-planner/commit/eae41d26a0895bde7e8ae8089dd5a8bd2cee341e))
* **chart:** add Chart and PieChart components for visualizing task distribution by day and status ([7219015](https://github.com/ThomasFourties/sc-planner/commit/7219015612e7e3b995250e2285983cd19734ad6f))
* **dashboard:** enhance dashboard with task loading, display, and improved layout ([ca4d277](https://github.com/ThomasFourties/sc-planner/commit/ca4d2776eefa4638b9322d672c7192c9ee46d3b6))
* **docker:** add Adminer service for database management in staging environment ([bdb2372](https://github.com/ThomasFourties/sc-planner/commit/bdb2372f4ac1dc0a928c3c93223e8897678b86ed))
* **docker:** add staging Docker Compose configuration and update deployment workflows ([1b1a441](https://github.com/ThomasFourties/sc-planner/commit/1b1a441809a44154d9eb24b150c39d55e7fd9702))
* **FormLoader:** add loading component with customizable status and spinner ([0fc2a2a](https://github.com/ThomasFourties/sc-planner/commit/0fc2a2aa99949693aab2242ee2c65f779b556a47))
* **health:** implement health check and metrics endpoints ([85a6d1a](https://github.com/ThomasFourties/sc-planner/commit/85a6d1a4f2090dab2a52cef55309e39ea373a171))
* **k8s:** add Kubernetes deployment ([75b8954](https://github.com/ThomasFourties/sc-planner/commit/75b8954b13de35143cb5d295b04a70529772e28f))
* **modal:** redesign modal component ([0f629b9](https://github.com/ThomasFourties/sc-planner/commit/0f629b903a4a3e710544349aec13103a62a97014))
* **planning:** enhance planning page with week navigation, task display, and detail modal ([ee70080](https://github.com/ThomasFourties/sc-planner/commit/ee70080d3982b0ec10b5843ac343c9534a0c85f2))
* **seeds:** add task seeding functionality to run-seed script ([c1ab268](https://github.com/ThomasFourties/sc-planner/commit/c1ab268e06ec396512c4baac1f3378f89b2789a7))
* **sidebar:** update user information display and add logout functionality ([b72c94b](https://github.com/ThomasFourties/sc-planner/commit/b72c94b0dfc525944f64fedab39ff5a82d2441af))
* **TaskDetailPanel:** create task detail panel component with editable fields and activity log ([3da07fe](https://github.com/ThomasFourties/sc-planner/commit/3da07fe030326ae84ec0e4a92eca954b692144a1))
* **tasks:** add API endpoints for retrieving and creating tasks ([4497922](https://github.com/ThomasFourties/sc-planner/commit/44979225025b351dda536ba94da32dd99a66f5a2))
* **tasks:** add CreateTaskForm component and implement task creation functionality with API integration ([e521c7f](https://github.com/ThomasFourties/sc-planner/commit/e521c7f7854e4e72fb76137740f51b79155d8ca6))
* **tasks:** add logging for user and task retrieval in findAssignedToMe method ([ea66733](https://github.com/ThomasFourties/sc-planner/commit/ea66733cb3a5ba0ab4dcd373ffe313cb3bd6d084))
* **tasks:** add migration and seed for tasks table with enums and example data ([19d129c](https://github.com/ThomasFourties/sc-planner/commit/19d129c48ce59ecdd0af7628610b1ad7f7b779c9))
* **tasks:** enhance task management interface with filtering, sorting, and detailed task view ([46419d0](https://github.com/ThomasFourties/sc-planner/commit/46419d030cf8479af3bdfd539cdf68928c3582b4))
* **tasks:** implement task management module with CRUD operations and DTOs ([95a1d99](https://github.com/ThomasFourties/sc-planner/commit/95a1d996dec32d21e693ae4e889cdf7f848ab7b8))
* **tasks:** implement task management module with CRUD operations and integrate with authentication ([78befd7](https://github.com/ThomasFourties/sc-planner/commit/78befd78b50bfa8dd2ae568a0714081aadb9ea85))
* **tasks:** implement useTasks composable for task management with API integration ([a980359](https://github.com/ThomasFourties/sc-planner/commit/a980359a11a9edb67ad7b264d38c4373a1d6a1f1))
* **tasks:** integrate TasksModule and update database configuration to include Task entity ([e5fad1b](https://github.com/ThomasFourties/sc-planner/commit/e5fad1b9f5a6b9f4fec9b5fe7b84255fb84ebe7e))
* **users:** add API endpoint for fetching user data ([c9fa98a](https://github.com/ThomasFourties/sc-planner/commit/c9fa98a73dbbf211428e217f2c44666838b4e46c))
* **workflows:** add changelog generation and production deployment workflow ([76e409b](https://github.com/ThomasFourties/sc-planner/commit/76e409bca9bd6c740d30237443f72f38f95f47db))
* **workflows:** implement cleanup of unused Docker images in staging deployment ([9631b86](https://github.com/ThomasFourties/sc-planner/commit/9631b867012eefe0e6067256f11587926781dd51))

## [0.4.0](https://github.com/ThomasFourties/sc-planner/compare/v0.3.9...v0.4.0) (2025-06-15)


### 📝 Documentation

* update README with release process and troubleshooting steps ([1252d04](https://github.com/ThomasFourties/sc-planner/commit/1252d04de48a5efcfd5c2344fecb2fd1702e09e5))

### [0.3.9](https://github.com/ThomasFourties/sc-planner/compare/v0.3.8...v0.3.9) (2025-06-15)


### 🛠️ Chore

* **release:** add GitHub push and release creation step ([99bb74f](https://github.com/ThomasFourties/sc-planner/commit/99bb74f70eabf246380c3251eb95fbb37e6d5ea4))

### [0.3.8](https://github.com/ThomasFourties/sc-planner/compare/v0.3.7...v0.3.8) (2025-06-15)


### ♻️ Refactoring

* **release:** replace local release script with enhanced GitHub release automation ([2728e1d](https://github.com/ThomasFourties/sc-planner/commit/2728e1d153a9c658e22116e20912971c8dcfa8de))

### [0.3.7](https://github.com/ThomasFourties/sc-planner/compare/v0.3.4...v0.3.7) (2025-06-15)


### ✨ Features

* **release:** add release-local script for version validation and automated tagging ([ba59d74](https://github.com/ThomasFourties/sc-planner/commit/ba59d747edc172879b6ed2a15ad44fe3f51549e2))
* **release:** add script to automate GitHub release creation with changelog extraction ([d444dfa](https://github.com/ThomasFourties/sc-planner/commit/d444dfab45873e7073ee665c9746776f6113172b))


### ♻️ Refactoring

* **release:** remove deprecated release script for version management ([79a9424](https://github.com/ThomasFourties/sc-planner/commit/79a94249180948151496505e513d42c1a561f6f4))


### 🐛 Bug Fixes

* **release:** remove local release script from automation process ([f670e84](https://github.com/ThomasFourties/sc-planner/commit/f670e84ef6d2a777259e51326163632b64435849))
* **release:** update release script to include local and GitHub release automation ([9153391](https://github.com/ThomasFourties/sc-planner/commit/9153391e2e30117bd258efae44a538c89e74ee57))

### [0.3.4](https://github.com/ThomasFourties/sc-planner/compare/v0.3.3...v0.3.4) (2025-06-15)


### 🛠️ Chore

* **release:** bump version to 0.3.3 for client and server ([5f0aac3](https://github.com/ThomasFourties/sc-planner/commit/5f0aac308626ae35973edb733a42b27fe234af52))
* **release:** simplify version validation and streamline release process ([1f4b83d](https://github.com/ThomasFourties/sc-planner/commit/1f4b83d089aaa2f89f2c8611ec312b817682c100))
* **release:** update standard-version configuration to include client and server package files ([13b4719](https://github.com/ThomasFourties/sc-planner/commit/13b4719045e871bda8fb3e0bb1c41edf36c4b350))

### [0.3.3](https://github.com/ThomasFourties/sc-planner/compare/v0.3.2...v0.3.3) (2025-06-15)


### ✨ Features

* **release:** add modified package.json files to git staging before auto commit ([9b9cb09](https://github.com/ThomasFourties/sc-planner/commit/9b9cb0960e00ad075397b76e7dedfd535a2ad238))


### 🛠️ Chore

* **release:** bump version to 0.3.2 for client and server ([bb9bfd9](https://github.com/ThomasFourties/sc-planner/commit/bb9bfd95888e9e719700ab7713c429cd55c631ad))
* update changelog workflow file formatting ([9998ab4](https://github.com/ThomasFourties/sc-planner/commit/9998ab458ef43dfbf1bf699970123dbe0a92b5b9))

### [0.3.2](https://github.com/ThomasFourties/sc-planner/compare/v0.3.1...v0.3.2) (2025-06-15)


### 🛠️ Chore

* **release:** bump version to 0.3.1 for client and server ([ed80e31](https://github.com/ThomasFourties/sc-planner/commit/ed80e31715a4be03d601187c653e9fcb6c3c6450))

### [0.3.1](https://github.com/ThomasFourties/sc-planner/compare/v0.3.0...v0.3.1) (2025-06-15)


### 🛠️ Chore

* **release:** update release script to include git push with tags ([96fb896](https://github.com/ThomasFourties/sc-planner/commit/96fb896e2e1a7e0f466d6abfd4dcd06dea9c385b))


### 🐛 Bug Fixes

* remove git push command from release script ([e3dff13](https://github.com/ThomasFourties/sc-planner/commit/e3dff13622033d9d9a8438e1f4f48eaf1de281bc))

## [0.3.0](https://github.com/ThomasFourties/sc-planner/compare/v0.2.9...v0.3.0) (2025-06-15)


### ✨ Features

* **release:** add script for automated release and push process ([177dc33](https://github.com/ThomasFourties/sc-planner/commit/177dc33096c1aec4b0f640d609502593c2bf8d90))


### 🛠️ Chore

* **release:** enhance version validation and update process in release script ([9f32617](https://github.com/ThomasFourties/sc-planner/commit/9f32617b87b25d30f40f03cd222d54ef2588bc93))
* **release:** improve tag handling in release script ([054e05f](https://github.com/ThomasFourties/sc-planner/commit/054e05f2ef852f6c1748dfece6dde9335c082678))
* **release:** remove git tag and push commands from release script ([1caf5db](https://github.com/ThomasFourties/sc-planner/commit/1caf5db84b05d88ab40616bc5ed9507158fd1006))
* **release:** update CHANGELOG format and add release-and-push script ([4ec856d](https://github.com/ThomasFourties/sc-planner/commit/4ec856dafd98e9fb630631c1695f6a5e211e8356))

## [0.3.0](https://github.com/ThomasFourties/sc-planner/compare/v0.2.9...v0.3.0) (2025-06-15)


### ✨ Features

* **release:** add script for automated release and push process ([177dc33](https://github.com/ThomasFourties/sc-planner/commit/177dc33096c1aec4b0f640d609502593c2bf8d90))


### 🛠️ Chore

* **release:** remove git tag and push commands from release script ([1caf5db](https://github.com/ThomasFourties/sc-planner/commit/1caf5db84b05d88ab40616bc5ed9507158fd1006))
* **release:** update CHANGELOG format and add release-and-push script ([4ec856d](https://github.com/ThomasFourties/sc-planner/commit/4ec856dafd98e9fb630631c1695f6a5e211e8356))

## [0.3.0](https://github.com/ThomasFourties/sc-planner/compare/v0.2.9...v0.3.0) (2025-06-15)


### ✨ Features

* **release:** add script for automated release and push process ([177dc33](https://github.com/ThomasFourties/sc-planner/commit/177dc33096c1aec4b0f640d609502593c2bf8d90))


### 🛠️ Chore

* **release:** remove git tag and push commands from release script ([1caf5db](https://github.com/ThomasFourties/sc-planner/commit/1caf5db84b05d88ab40616bc5ed9507158fd1006))
* **release:** update CHANGELOG format and add release-and-push script ([4ec856d](https://github.com/ThomasFourties/sc-planner/commit/4ec856dafd98e9fb630631c1695f6a5e211e8356))

### [0.2.9](https://github.com/ThomasFourties/sc-planner/compare/v0.2.8...v0.2.9) (2025-06-15)


### 🐛 Bug Fixes

* **release:** update regex to match new changelog format for version sections ([6e75f03](https://github.com/ThomasFourties/sc-planner/commit/6e75f030d18117c37cb13617ee4bc1197107596b))


### ✨ Features

* **release:** add check for existing version tag before release ([0fd0120](https://github.com/ThomasFourties/sc-planner/commit/0fd01209a373cb1f46d34c5c8a606fa9b9893bfa))


### 🛠️ Chore

* **release:** 0.2.8 ([1870e90](https://github.com/ThomasFourties/sc-planner/commit/1870e90b4ec3390929696632c51b6a9064cf3029))
* **release:** 0.2.8 ([6148898](https://github.com/ThomasFourties/sc-planner/commit/614889839ea723b7ed820956c41f4caca8bb4893))
* **release:** 0.2.9 ([1bc8a56](https://github.com/ThomasFourties/sc-planner/commit/1bc8a56e7fa66e7a81385beeda6dc7934f3c57b4))
* **release:** 0.2.9 ([d1cc53f](https://github.com/ThomasFourties/sc-planner/commit/d1cc53f421b28fbde827bafb03dae471b1e715fa))
* **release:** downgrade version to 0.2.8 in package.json ([6b81d57](https://github.com/ThomasFourties/sc-planner/commit/6b81d57cbde4051481feaf9490f1e4c0d46b9888))
* **release:** remove outdated 0.2.9 entry from CHANGELOG ([cafb365](https://github.com/ThomasFourties/sc-planner/commit/cafb3655939d15d229180cd39ea237bc9a451f67))
* **release:** update CHANGELOG to remove outdated 0.2.9 entry ([188a993](https://github.com/ThomasFourties/sc-planner/commit/188a9931ba015eb1522184cca49041af228360ff))

### [0.2.8](https://github.com/ThomasFourties/sc-planner/compare/v0.2.7...v0.2.8) (2025-06-15)


### 🐛 Bug Fixes

* **release:** handle case when there are no changes to commit ([2a963d5](https://github.com/ThomasFourties/sc-planner/commit/2a963d5cfeb70d294dac2c5e6f79dcbc13fb004f))

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


## [0.1.0] (2025-06-15)


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
