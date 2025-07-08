import 'dotenv/config';
export default{
  expo: {
    name: "Correos Clic",
    slug: "Correos Clic",
    version: "1.0.0",
    orientation: "portrait",
    icon: "assets/icons_correos_mexico/square_correos_clic_Logo.png",
    resizeMode: "cover",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    scheme: "correosclic",
    splash: {
      image: "assets/icons_correos_mexico/square_correos_clic_Logo.png",
      resizeMode: "cover",
      backgroundColor: "#DE1484"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.correosmexico.correosclic"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "assets/icons_correos_mexico/square_correos_clic_Logo.png",
        resizeMode: "cover"
      },
      orientation: "portrait",
      edgeToEdgeEnabled: true,
      package: "com.correosmexico.correosclic"
    },
    web: {
      favicon: "assets/icons_correos_mexico/square_correos_clic_Logo.png"
    },
    extra: {
      IP_LOCAL: process.env.IP_LOCAL,
    }
  }
}
