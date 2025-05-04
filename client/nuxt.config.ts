export default defineNuxtConfig({
  compatibilityDate: '2025-01-21',

  devtools: { enabled: false },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'lottie-player',
    },
  },

  // Modifié pour prendre en charge le SSR avec hydration côté client
  // Cela permet de résoudre les problèmes de navigation et de rafraîchissement
  ssr: true,

  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
      API_AUTH_TOKEN: process.env.API_AUTH_TOKEN,
      // Ajout d'une configuration pour l'environnement
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

  // Configuration des règles de route pour que le SPA fonctionne correctement
  routeRules: {
    '/**': { ssr: true },
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
    // Optimisation pour la production
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
    // Ajout d'un CDN URL pour les environnements de production
    cdnURL: process.env.NODE_ENV === 'production' ? 'https://test.thomasfourties.fr' : '',
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

  // Configuration améliorée pour les images
  image: {
    provider: 'ipx',
    dir: 'public',
    domains: ['test.thomasfourties.fr'],
    format: ['webp', 'jpg', 'png'],
  },

  // Ajout de la configuration des pages
  pages: true,

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
