const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].bundle.js'
  },
  devtool: 'eval-source-map',
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    compress: true,
    static: {
      directory: './public'
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
});