// frontend/nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      strapiBase: process.env.STRAPI_URL || 'http://localhost:1337'
    }
  }
})
