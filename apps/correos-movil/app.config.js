require('dotenv').config();

module.exports = ({ config }) => {
  return {
    ...config,
    expo: {
      ...config.expo,
      plugins: [
        ...(config.expo?.plugins || []),
        'expo-font'
      ],
      extra: {
        IP_LOCAL: process.env.IP_LOCAL
      }
    }
  };
};