export default defineNuxtConfig({
  compatibilityDate: '2025-01-21',

  devtools: { enabled: false },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'lottie-player',
    },
  },

  ssr: false,

  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
      API_AUTH_TOKEN: process.env.API_AUTH_TOKEN,
      ENV: process.env.NODE_ENV || 'development',
    },
  },

  nitro: {
    devProxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' ? 'http://server:3001/api' : 'http://localhost:3002/api',
        changeOrigin: true,
        prependPath: false,
      },
    },
  },

  routeRules: {
    '/**': { ssr: false },
  },

  css: ['@/assets/scss/main.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
    server: {
      fs: {
        strict: false,
      },
    },
    build: {
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'chunks/[name]-[hash].js',
          entryFileNames: 'entries/[name]-[hash].js',
        },
      },
    },
  },

  app: {
    baseURL: '/',
    cdnURL: process.env.NODE_ENV === 'production' ? 'https://sc-planner.thomasfourties.fr' : '',
    head: {
      htmlAttrs: {
        lang: 'fr',
      },
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover',
        },
        // Ajout de meta pour empêcher les problèmes de navigation
        {
          name: 'base',
          content: '/',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
      ],
      script: [
        {
          src: 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js',
          type: 'module',
        },
      ],
    },
  },

  modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    'nuxt-svgo',
    '@nuxtjs/sitemap',
    // 'nuxt-gtag',
    // 'nuxt-module-hotjar',
    // 'nuxt-swiper',
  ],

  image: {
    provider: 'ipx',
    dir: 'public',
    domains: ['sc-planner.thomasfourties.fr'],
    format: ['webp', 'jpg', 'png'],
  },

  // plugins: [{ src: '~/utils/windowSize.js', mode: 'client' }],

  // sitemap: {
  //   sources: ['https://www.example.com/sitemap'],
  //   cacheMaxAgeSeconds: 1,
  //   exclude: ['/', '/404', '/home'],
  // },

  components: [
    { path: '~/components/', pathPrefix: false },
    { path: '~/components/utils/', pathPrefix: false },
  ],
});
