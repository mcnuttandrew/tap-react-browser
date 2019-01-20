const webpack = require('webpack');

module.exports = {
  entry: {app: './src/index'},
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: [/node_modules/]
    }]
  },
  // unsure if right
  node: {
    fs: 'empty'
  },
  output: {
    filename: './index.js',
    libraryTarget: 'umd',
    publicPath: '/'
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'  // eslint-disable-line
};
