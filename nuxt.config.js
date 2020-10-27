export default {
  mode: "spa",
  /*
   ** Headers of the page
   ** Doc: https://vue-meta.nuxtjs.org/api/#metainfo-properties
   */
  head: {
    htmlAttrs: {
      lang: "ja",
      prefix: "og: http://ogp.me/ns#"
    },
    title: "推敲オンライン",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "推敲オンラインはカタチになる前のアイデアにアドバイスや意見を持ち寄り、カタチになるまでを応援するサイトです。"
      },
      {
        hid: "og:site_name",
        property: "og:site_name",
        content: "推敲オンライン"
      },
      { hid: "og:type", property: "og:type", content: "website" },
      {
        hid: "og:url",
        property: "og:url",
        content: "https://suikoonline.netlify.app/"
      },
      { hid: "og:title", property: "og:title", content: "推敲オンライン" },
      {
        hid: "og:description",
        property: "og:description",
        content:
          "推敲オンラインはカタチになる前のアイデアにアドバイスや意見を持ち寄り、カタチになるまでを応援するサイトです。"
      },
      {
        hid: "og:image",
        property: "og:image",
        content:
          "https://vectr.com/ninjin_umigame_/b2LrTvo4h.svg?width=640&height=480&select=b2LrTvo4hpage0"
      },
      { name: "twitter:card", content: "summary" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  /*
   ** Global CSS
   ** Doc: https://nuxtjs.org/api/configuration-css
   */
  css: ["firebaseui/dist/firebaseui.css"],

  /*
   ** Plugins to load before mounting the App
   ** Doc: https://nuxtjs.org/guide/plugins
   */
  plugins: [],

  /*
   ** Nuxt.js modules
   ** Doc: https://nuxtjs.org/guide/modules
   */
  modules: [
    // Doc: https://http.nuxtjs.org
    "@nuxt/http",
    // TODO: Remove it if you want to eject from codeSandbox
    "./codesandbox"
  ],

  /*
   ** HTTP module configuration
   */
  http: {
    // See https://http.nuxtjs.org/api/#options
  },

  /*
   ** Build configuration
   ** Doc: https://nuxtjs.org/api/configuration-build
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },

  buildModules: ["@nuxtjs/vuetify"]
};
