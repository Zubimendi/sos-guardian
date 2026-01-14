// Jest setup file - mocks and global test configuration
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    default: {
      View,
      Text: require('react-native').Text,
      Image: require('react-native').Image,
      ScrollView: require('react-native').ScrollView,
    },
    Easing: {
      linear: () => {},
      ease: () => {},
    },
    useSharedValue: (init) => ({ value: init }),
    useAnimatedStyle: () => ({}),
    withTiming: (toValue) => toValue,
    withSpring: (toValue) => toValue,
    runOnJS: (fn) => fn,
    runOnUI: (fn) => fn,
  };
});
