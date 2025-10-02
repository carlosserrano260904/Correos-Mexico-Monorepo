require('dotenv').config();

module.exports = ({ config }) => {
  return {
    ...config,
    expo: {
      ...config.expo,
      extra: {
        IP_LOCAL: process.env.IP_LOCAL
      }
    }
  };
};