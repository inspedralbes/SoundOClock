// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    'nuxt-socket-io',
    '@samk-dev/nuxt-vcalendar',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/device',
    "@nuxt/ui"
  ],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,1,0' },
        { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/futura-font@1.0.0/styles.min.css"},
        { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" },
      ]
    }
  },
  device: {
    refreshOnResize: true
  },
  runtimeConfig: {
    public: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      SOCKET_URI: process.env.SOCKET_URI,
    },
    private: {
    },
  },
  ssr: false,
  colorMode: {
    preference: 'dark'
  }
})