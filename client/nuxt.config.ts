export default defineNuxtConfig({
  compatibilityDate: '2025-01-21',

  devServer: {
    port: process.env.NODE_ENV === 'production' ? undefined : 3000,
    host: '0.0.0.0',
  },

  devtools: { enabled: false },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'lottie-player',
    },
  },

  ssr: true,

  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL || 'http://localhost:3002/api',
    },
  },

  css: ['@/assets/scss/main.scss'],

  nitro: {
    preset: 'node-server'
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
  },

  app: {
    baseURL: '/',
    head: {
      htmlAttrs: {
        lang: 'fr',
      },
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover',
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

  modules: ['@pinia/nuxt', '@nuxt/image', '@nuxt/fonts', 'nuxt-svgo', '@nuxtjs/sitemap', // 'nuxt-gtag',
  // 'nuxt-module-hotjar',
  // 'nuxt-swiper',
  '@vueuse/nuxt',
  'nuxt-lucide-icons',
  // '@nuxtjs/tailwindcss',
  '@samk-dev/nuxt-vcalendar',
],

  vcalendar: {
    defaultCss: true,
    autoImports: {
      DatePicker: true,
      Calendar: true
    }
  },

  site: { url: process.env.FRONTEND_URL || 'http://localhost:3000' },

  // gtag: {
  //   enabled: process.env.ENV_STATUS === 'production',
  //   id: 'G-XXXXXXXXXX',
  // },

  // hotjar: {
  //   hotjarId: XXXXXXX,
  //   scriptVersion: X,
  // },

  // plugins: [{ src: '~/utils/windowSize.js', mode: 'client' }],

  // sitemap: {
  //   sources: ['https://www.example.com/sitemap'],
  //   cacheMaxAgeSeconds: 1,
  //   exclude: ['/', '/home'],
  // },

  components: [
    { path: '~/components/', pathPrefix: false },
    { path: '~/components/utils/', pathPrefix: false },
  ],

  image: {
    provider: 'ipx',
    dir: 'public',
    quality: 80,
    format: ['webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    alias: {
      '/images': '/images',
    },
  },
});