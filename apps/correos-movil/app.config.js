require('dotenv').config();

module.exports = ({ config }) => ({
  ...config,
  expo: {
    name: "Correos de Mexico",
    slug: "correos-de-mexico",
    version: "1.0.1",
    assetBundlePatterns: ["**/*"],
    orientation: "portrait",
    icon: "./assets/icons_correos_mexico/square_correos_clic_Logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/icons_correos_mexico/square_correos_clic_Logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icons_correos_mexico/square_correos_clic_Logo.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: "./assets/icons_correos_mexico/square_correos_clic_Logo.png",
    },
    extra: {
      IP_LOCAL: process.env.IP_LOCAL,
    },
  },
});
