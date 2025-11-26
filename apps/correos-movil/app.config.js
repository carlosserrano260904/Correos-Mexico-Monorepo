require("dotenv").config();

module.exports = ({ config }) => ({
  ...config,
  expo: {
    name: "Correos de Mexico",
    slug: "correos-de-mexico",
    version: "1.0.2",
    scheme: "correosdemexico",
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
      bundleIdentifier: "com.seanalytics.correosdemexico",
      infoPlist: {
        CFBundleURLTypes: [
          {
            CFBundleURLSchemes: ["correosdemexico"], // must match your scheme
          },
        ],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage:
          "./assets/icons_correos_mexico/square_correos_clic_Logo.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.seanalytics.correosdemexico",
      intentFilters: [
        {
          action: "VIEW",
          data: [
            {
              scheme: "correosdemexico",
              host: "sso-callback",
            },
          ],
          category: ["BROWSABLE", "DEFAULT"],
        },
      ],
    },
    web: {
      favicon: "./assets/icons_correos_mexico/square_correos_clic_Logo.png",
    },
    extra: {
      IP_LOCAL: process.env.IP_LOCAL,
      eas: {
        projectId: "a0f0754d-99de-4334-a9be-935e19938c4a",
      },
    },
    owner: "seanalytics",
  },
});
