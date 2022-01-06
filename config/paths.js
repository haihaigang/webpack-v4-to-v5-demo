// eslint-disable-next-line strict
"use strict"

const path = require("path")
const fs = require("fs")
const url = require("url")
const getPublicUrlOrPath = require("react-dev-utils/getPublicUrlOrPath")

// let args = process.argv.slice(2)[0]
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const envPublicUrl = process.env.PUBLIC_URL

function ensureSlash(path, needsSlash) {
  const hasSlash = path.endsWith("/")
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1)
  } else if (!hasSlash && needsSlash) {
    return `${path}/`
  } else {
    return path
  }
}

const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
const publicUrlOrPath = getPublicUrlOrPath(
  process.env.NODE_ENV === "development",
  require(resolveApp("package.json")).homepage,
  process.env.PUBLIC_URL
)
// function getServedPath(appPackageJson) {
//   const publicUrl = getPublicUrl(appPackageJson)
//   const servedUrl =
//     envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : "/")
//   return ensureSlash(servedUrl, true)
// }

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp(".env"),
  appPath: resolveApp("."),
  appBuild: resolveApp("../mt-sw-front-sw-mobile/build"),
  appProdBuild: resolveApp("../mt-sw-front-sw-mobile/build"),
  appPublic: resolveApp("public"),
  appHtml: resolveApp("public/index.html"),
  appSingleHtml: resolveApp("public/index.single.html"),
  appDevHtml: resolveApp("public/index.dev.html"),
  appDevelopHtml: resolveApp("public/index.develop.html"),
  appSxHtml: resolveApp("public/index.sx.html"),
  appIndexJs: resolveApp("src/index/index.js"),
  appPackageJson: resolveApp("package.json"),
  appSrc: resolveApp("src"),
  yarnLockFile: resolveApp("yarn.lock"),
  testsSetup: resolveApp("src/setupTests.js"),
  appNodeModules: resolveApp("node_modules"),
  publicUrl: getPublicUrl(resolveApp("package.json")),
  // servedPath: getServedPath(resolveApp("package.json")),
  publicUrlOrPath,
}
