var path = require('path');
var webpack = require('webpack');


module.exports = {
  entry: './index.js',
  output: { path: __dirname, filename: 'bundle.js' },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    hot: true
  },
  watchOptions: {
    poll: true
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', "stage-0"]
        }
      },{
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
    },{
      test: /\.(?:png|jpg|svg)$/,
      loader: 'url-loader',
      query: {
        // Inline images smaller than 10kb as data URIs
        limit: 10000
      }
    }
    ]
  },
};
