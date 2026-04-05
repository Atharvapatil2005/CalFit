const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const wsShimPath = path.resolve(__dirname, 'src/shims/ws.js');
const useLatestCallbackPath = path.resolve(
  __dirname,
  'node_modules/use-latest-callback/lib/src/index.js'
);

config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  'use-latest-callback': useLatestCallbackPath,
  ws: wsShimPath,
};

const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'ws') {
    return {
      filePath: wsShimPath,
      type: 'sourceFile',
    };
  }

  if (moduleName === 'use-latest-callback') {
    return {
      filePath: useLatestCallbackPath,
      type: 'sourceFile',
    };
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
