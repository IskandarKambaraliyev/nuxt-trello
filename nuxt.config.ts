// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    auth: {
      secret: process.env.AUTH_SECRET,
      origin: process.env.AUTH_ORIGIN,
    },
    public: {
      pixabayApiKey: process.env.PIXABAY_API_KEY,
    },
  },
  modules: ["@nuxt/ui", "nuxt-server-utils", "@sidebase/nuxt-auth", "@nuxt/image"],
  ui: {},
  nuxtServerUtils: {
    mongodbUri: process.env.MONGODB_URI,
  },
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: "authjs",
    },
  },
});