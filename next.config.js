const withPlugins = require("next-compose-plugins");
const withAntdLess = require("next-plugin-antd-less");

const pluginAntdLess = withAntdLess({
  modifyVars: {
    "@primary-color": "#0f0",
  },
  lessVarsFilePath: "./src/styles/variables.less",
  // cssLoaderOptions: {
  // esModule: false,
  // sourceMap: false,
  // modules: {
  // mode: 'local',
  // localIdentName: '[hash:2]',
  // },
  // },
});

module.exports = withPlugins([[pluginAntdLess]], {
  webpack(config) {
    return config;
  },
  reactStrictMode: true,
  // images: {
  //   disableStaticImages: true,
  // },
  // NextFuture
  // future: {
  //   webpack5: true,
  // },
});
