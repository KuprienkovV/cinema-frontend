export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@pinia/nuxt',
    'nuxt-toast',
  ],

  css: ['~/assets/main.scss'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    }
  },

  routeRules: {
    '/': { redirect: { to: '/movies', statusCode: 308 } },
    '/auth': { redirect: { to: '/auth/login', statusCode: 308 } },
  },
})