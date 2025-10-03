const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../../');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver = {
  ...(config.resolver || {}),
  unstable_enableSymlinks: true,
  nodeModulesPaths: [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ],
  extraNodeModules: {
    react: path.resolve(workspaceRoot, 'node_modules/react'),
    'react-dom': path.resolve(workspaceRoot, 'node_modules/react-dom'),
    'react-native': path.resolve(workspaceRoot, 'node_modules/react-native'),
    'react-native-web': path.resolve(workspaceRoot, 'node_modules/react-native-web'),
    expo: path.resolve(workspaceRoot, 'node_modules/expo'),
  },
};

module.exports = config;