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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ],
  output: {
    filename: './index.js',
    libraryTarget: 'umd',
    publicPath: '/'
  }
};
