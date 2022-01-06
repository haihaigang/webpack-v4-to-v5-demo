// eslint-disable-next-line strict
"use strict"

process.env.BABEL_ENV = "development"
process.env.NODE_ENV = "development"

const path = require("path")
const webpack = require("webpack")
const merge = require("webpack-merge")
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const configFactory = require("./webpack.dll.config")
const paths = require("./paths")
const P0 = require("../p1.js")

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
// const publicPath = 'http://local.app.mengtuiapp.com/';
const publicPath = '/';

// This is the development configuration.
// It is focused on developer experience and fast rebuilds.
// The production configuration is different and lives in a separate file.
module.exports = merge(configFactory("development"), {
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  // The first two entry points enable "hot" CSS and auto-refreshes for JS.
  mode: "development",
  entry: {
  login : [
  require.resolve("./polyfills"),
  'babel-polyfill',
  require.resolve('react-dev-utils/webpackHotDevClient'),
  paths.appSrc + "/login/index.js",
],index : [
  require.resolve("./polyfills"),
  'babel-polyfill',
  require.resolve('react-dev-utils/webpackHotDevClient'),
  paths.appSrc + "/index/index.js",
],
  },
  output: {
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // This is the URL that app is served from. We use "/" in development.
    publicPath: publicPath,
    crossOriginLoading: "anonymous",
    filename: "[name].dll.js",
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
  new HtmlWebpackPlugin({
  title : '登录',
  inject: true,
  chunks: [ "login" ],
  template: paths.appDevHtml,
  external_js : '',
  filename: 'login.html',
  backbone: '',
  mock_domain: 'mock-qa.shouwuapp.com'
}),new HtmlWebpackPlugin({
  title : '首物',
  inject: true,
  chunks: [ "index" ],
  template: paths.appDevHtml,
  external_js : '',
  filename: 'index.html',
  backbone: '',
  mock_domain: 'mock-qa.shouwuapp.com'
}),
    // new AddAssetHtmlPlugin({
    //   filepath: path.resolve(__dirname, "../build/*.dll.js"),
    // }),
    // Add module names to factory functions so they appear in browser profiler.
    // new webpack.NamedModulesPlugin(),
    new P0(),
  ],
})
