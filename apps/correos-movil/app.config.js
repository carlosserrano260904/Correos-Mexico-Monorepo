import 'dotenv/config';
export default{
  expo: {
    name: "Correos Clic",
    slug: "Correos Clic",
    version: "1.0.0",
    orientation: "portrait",
    icon: "assets/icons_correos_mexico/square_correos_clic_Logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "assets/icons_correos_mexico/square_correos_clic_Logo.png",
      resizeMode: "cover",
      backgroundColor: "#DE1484"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "assets/icons_correos_mexico/square_correos_clic_Logo.png",
        resizeMode: "cover"
      },
      orientation: "portrait",
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "assets/icons_correos_mexico/square_correos_clic_Logo.png"
    },
    extra: {
      IP_LOCAL: process.env.IP_LOCAL,
    }
  }
}
