const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const helpers = require('./helpers');

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    // 'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [ {
      test: /\.ts$/,
      loaders: [ {
          loader: 'awesome-typescript-loader',
          options: { configFileName: helpers.root('src', 'tsconfig.working.json') }
        } , 'angular2-template-loader' ]
    }, {
      test: /\.html$/,
      loader: 'html-loader'
    }, {
      test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
      loader: 'file-loader?name=assets/[name].[hash].[ext]'
    }, {
      test: /\.css$/,
      exclude: helpers.root('src', 'app'),
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    }, {
      test: /\.css$/,
      include: helpers.root('src', 'app'),
      loader: 'raw-loader'
    } ]
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },

  plugins: [
    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('./src'), // location of your src
      {} // a map of your routes
    ),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css'
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      chunksSortMode: 'manual',
      chunks: ['polyfills', 'vendor', 'app']
    })
  ]
};
