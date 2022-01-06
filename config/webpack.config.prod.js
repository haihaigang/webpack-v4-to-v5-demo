const fs = require("fs")
const outputPublicPath = "//f.shouwuapp.com/app/"
const path = require("path")
const merge = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const paths = require("./paths")
const getClientEnvironment = require("./env")
const configFactory = require("./webpack.dll.config")
// const AssetsPlugin = require("assets-webpack-plugin")
/*const assetsPluginInstance = new AssetsPlugin({
  includeAllFileTypes: false,
  fileTypes: ["js"],
  integrity: true,
  processOutput: function(assets) {
    // saveManifest(assets)
    return ""
  },
})*/

function getPageVersion() {
  function zeroPad(num) {
    if (num < 10) {
      return `0${num}`
    } else {
      return `${num}`
    }
  }

  let d = new Date()
  let YYYY = d.getFullYear()
  let MM = d.getMonth() + 1
  let DD = d.getDate()
  let hh = d.getHours()
  let mm = d.getMinutes()
  return `${YYYY}${zeroPad(MM)}${zeroPad(DD)}${zeroPad(hh)}${zeroPad(mm)}`
}

function saveManifest(assets = {}) {
  const common_file_names = ["vendor", "common", "manifest"]
  let vendor_data = assets.vendor || {}
  let common_data = assets.common || {}
  let manifest_data = assets.manifest || {}
  let page_names = []

  for (let name in assets) {
    if (!common_file_names.includes(name)) {
      page_names.push(name)
    }
  }

  let version = getPageVersion()

  fs.readFile(
    __dirname + "/version_manifest.js",
    { flag: "r+", encoding: "utf8" },
    function(err, data) {
      if (err) {
        fs.writeFile(
          __dirname + "/version_manifest.js",
          `window.__page_traveler={}`,
          function(err) {
            if (err) {
              console.error(err)
            } else {
              saveManifest(assets)
            }
          }
        )

        return
      }

      try {
        let obj = JSON.parse(data.replace("window.__page_traveler=", ""))
        // console.log(">>obj", obj)
        page_names.forEach(page_name => {
          if (obj[page_name]) {
            obj[page_name][version] = {
              vendor: vendor_data,
              common: common_data,
              manifest: manifest_data,
              page: assets[page_name] || {},
            }
          } else {
            obj[page_name] = {}
            obj[page_name][version] = {
              vendor: vendor_data,
              common: common_data,
              manifest: manifest_data,
              page: assets[page_name] || {},
            }
          }
        })

        let str_from_obj = JSON.stringify(obj, null, 2)
        // console.log(">>str_from_obj", str_from_obj)
        fs.writeFile(
          __dirname + "/version_manifest.js",
          `window.__page_traveler=${str_from_obj}`,
          function(err) {
            if (err) {
              console.log("error in manifest handle write file")
            } else {
              console.log(
                "manifest add success: ",
                version,
                page_names.join(",")
              )
            }
          }
        )
      } catch (e) {
        console.log("error in manifest handle")
      }
    }
  )

  // console.log("--///////")
  // console.log(assets)
  // console.log("///////--")
}
// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
const publicPath = paths.servedPath
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
const publicUrl = publicPath.slice(0, -1)
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl)

// Assert this just to be safe.
// Development builds of React are slow and not intended for production.
if (env.stringified["process.env"].NODE_ENV !== '"production"') {
  throw new Error("Test builds must have NODE_ENV=production.")
}

const chunksSortMode = (chunk1, chunk2) => {
  const orders = ["common", "vendor", "manifest"]

  let order_1 = orders.indexOf(chunk1),
    order_2 = orders.indexOf(chunk2)

  return order_2 - order_1
}

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
module.exports = merge(configFactory("production"), {
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: false,
  // In production, we only want to load the polyfills and the app code.
  entry: {
    
login : [
  "core-js/stable",
  "whatwg-fetch",
  paths.appSrc + "/login/index.js",
],

  },
  output: {
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: outputPublicPath,
    crossOriginLoading: "anonymous",
  },
  recordsPath: path.resolve(__dirname, "./recordsPath.json"),
  plugins: [
new HtmlWebpackPlugin({
  title: '登录',
  inject: false,
  chunks: ["login"],
  template: paths.appHtml,
  external_js : '',
  filename: 'login.html',
  backbone: ''
}),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: { drop_console: true },
        },
      }),
    ],
  },
})
