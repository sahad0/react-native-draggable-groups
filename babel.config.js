module.exports = {
  presets: [
    ['module:react-native-builder-bob/babel-preset', { modules: 'commonjs' }],
    ['module:metro-react-native-babel-preset'],
  ],
  plugins: ['react-native-reanimated/plugin'],
};
