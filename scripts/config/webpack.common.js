const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('../paths');

module.exports = {
  entry: {
    app: paths.appIndex,
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: paths.appHtml,
      cache: true,
    }),
  ],
};
