const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  pwa: {
    manifestOptions: {
      name: "ОКО",
      short_name: "ОКО",
      start_url: "./",
      display: "standalone",
      icons: [
        {
          src: "./img/icons/android-launchericon-512-512.png",
          sizes: "512x512",
          type: "image/svg+xml",
          purpose: "any maskable",
        },
        {
          src: "./img/icons/android-launchericon-144-144.png",
          sizes: "144x144",
          type: "image/svg+xml",
          purpose: "any maskable",
        },
        {
          src: "./img/icons/LargeTile.scale-150.png",
          sizes: "150x150",
          type: "image/svg+xml",
          purpose: "any maskable",
        },
        {
          src: "./img/icons/Square44x44Logo.scale-150.png",
          sizes: "150x150",
          type: "image/svg+xml",
          purpose: "any maskable",
        },
      ],
    },
  },
});
