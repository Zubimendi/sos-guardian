// Minimal Babel config for Expo – rely on Expo's defaults, no custom plugins.
// This avoids requiring the react-native-reanimated worklets plugin, which
// is not necessary for our usage (we use the core Animated API instead).
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
};
