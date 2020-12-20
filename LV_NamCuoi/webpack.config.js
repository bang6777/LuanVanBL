const webpack = require("webpack");
const path = require("path");
const autoprefixer = require("autoprefixer");

const CopyPlugin = require("copy-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const WebPackBar = require("webpackbar");

const entry = path.join(__dirname, "./src/index.js");
const sourcePath = path.join(__dirname, "./source");
const outputPath = path.join(__dirname, "./dist");

const vtkRules = require("vtk.js/Utilities/config/dependency.js").webpack.core
  .rules;
const cssRules = require("vtk.js/Utilities/config/dependency.js").webpack.css
  .rules;

const devServer = {
  noInfo: true,
  stats: "minimal"
};

module.exports = {
  node: {
    fs: "empty"
  },
  entry,
  output: {
    path: outputPath,
    filename: "itkVtkViewer.js"
  },
  module: {
    rules: [
      { test: entry, loader: "expose-loader?itkVtkViewer" },
      { test: /\.js$/, loader: "babel-loader" },
      { test: /\.(png|jpg)$/, use: "url-loader?limit=81920" },
      { test: /\.svg$/, use: [{ loader: "raw-loader" }] }
    ].concat(vtkRules, cssRules)
  },
  plugins: [
    new CopyPlugin([
      {
        from: path.join(
          __dirname,
          "node_modules",
          "workbox-sw",
          "build",
          "importScripts",
          "workbox-sw.prod.*.js"
        ),
        flatten: true,
        to: path.join(__dirname, "dist")
      },
      {
        from: path.join(__dirname, "node_modules", "itk", "WebWorkers"),
        to: path.join(__dirname, "dist", "itk", "WebWorkers")
      },
      {
        from: path.join(__dirname, "node_modules", "itk", "ImageIOs"),
        to: path.join(__dirname, "dist", "itk", "ImageIOs")
      },
      {
        from: path.join(__dirname, "node_modules", "itk", "MeshIOs"),
        to: path.join(__dirname, "dist", "itk", "MeshIOs")
      },
      {
        from: path.join(__dirname, "node_modules", "itk", "Pipelines"),
        to: path.join(__dirname, "dist", "itk", "Pipelines")
      }
    ]),
    // workbox plugin should be last plugin
    new WorkboxPlugin({
      globDirectory: outputPath,
      maximumFileSizeToCacheInBytes: 5000000,
      globPatterns: ["*.{html,jpg,js,png,svg}"],
      globIgnores: ["serviceWorker.js"],
      swSrc: path.join("src", "serviceWorker.js"),
      swDest: path.join("dist", "serviceWorker.js")
    }),
    new WebPackBar()
  ],
  resolve: {
    extensions: [
      ".webpack-loader.js",
      ".web-loader.js",
      ".loader.js",
      ".js",
      ".jsx"
    ],
    modules: [path.resolve(__dirname, "node_modules"), sourcePath]
  },
  performance: {
    maxAssetSize: 15000000,
    maxEntrypointSize: 15000000
  },
  devServer
};

// const webpack = require("webpack");
// const path = require("path");
// const autoprefixer = require("autoprefixer");

// const CopyPlugin = require("copy-webpack-plugin");
// const { GenerateSW } = require("workbox-webpack-plugin");
// const WebPackBar = require("webpackbar");

// const entry = path.join(__dirname, "./src/index.js");
// const sourcePath = path.join(__dirname, "./source");
// const outputPath = path.join(__dirname, "./dist");

// const vtkRules = require("vtk.js/Utilities/config/dependency.js").webpack.core
//   .rules;
// const cssRules = require("vtk.js/Utilities/config/dependency.js").webpack.css
//   .rules;

// const packageJSON = require("./package.json");
// const itkVersion = packageJSON.dependencies.itk.substring(1);
// const cdnPath = "https://unpkg.com/itk@" + itkVersion;

// const devServer = {
//   noInfo: true,
//   stats: "minimal"
// };

// const node = {
//   fs: "empty"
// };

// const moduleConfig = {
//   rules: [
//     { test: entry, loader: "expose-loader?itkVtkViewer" },
//     { test: /\.js$/, loader: "babel-loader" },
//     { test: /\.(png|jpg)$/, use: "url-loader?limit=81920" },
//     { test: /\.svg$/, use: [{ loader: "raw-loader" }] }
//   ].concat(vtkRules, cssRules)
// };

// const performance = {
//   maxAssetSize: 15000000,
//   maxEntrypointSize: 15000000
// };

// module.exports = [
//   // Progressive web app
//   {
//     node,
//     module: moduleConfig,
//     output: {
//       path: outputPath,
//       filename: "itkVtkViewer.js"
//     },
//     plugins: [
//       new CopyPlugin([
//         {
//           from: path.join(__dirname, "node_modules", "itk", "WebWorkers"),
//           to: path.join(__dirname, "dist", "itk", "WebWorkers")
//         },
//         {
//           from: path.join(__dirname, "node_modules", "itk", "ImageIOs"),
//           to: path.join(__dirname, "dist", "itk", "ImageIOs")
//         },
//         {
//           from: path.join(__dirname, "node_modules", "itk", "MeshIOs"),
//           to: path.join(__dirname, "dist", "itk", "MeshIOs")
//         },
//         {
//           from: path.join(__dirname, "node_modules", "itk", "PolyDataIOs"),
//           to: path.join(__dirname, "dist", "itk", "PolyDataIOs")
//         },
//         {
//           from: path.join(__dirname, "node_modules", "itk", "Pipelines"),
//           to: path.join(__dirname, "dist", "itk", "Pipelines")
//         },
//         {
//           from: path.join(
//             __dirname,
//             "src",
//             "Compression",
//             "blosc-zarr",
//             "web-build"
//           ),
//           to: path.join(__dirname, "dist", "itk", "Pipelines")
//         }
//       ]),
//       // workbox plugin should be last plugin
//       new GenerateSW({
//         importWorkboxFrom: "local",
//         globDirectory: outputPath,
//         maximumFileSizeToCacheInBytes: 5000000,
//         include: [],
//         exclude: [],
//         globPatterns: ["*.{html,js,jpg,png,svg}"],
//         globIgnores: ["serviceWorker.js", "precache-manifest.*.js", "itk/**"],
//         swDest: path.join(__dirname, "dist", "serviceWorker.js"),
//         runtimeCaching: [
//           {
//             urlPattern: /\.js|\.png|\.wasm$/,
//             handler: "StaleWhileRevalidate",
//             options: {
//               cacheName: "itk-vtk-viewer-StaleWhileRevalidate",
//               expiration: {
//                 maxEntries: 50,
//                 maxAgeSeconds: 7 * 24 * 60 * 60 * 2
//               }
//             }
//           }
//         ]
//       }),
//       new WebPackBar()
//     ],
//     performance,
//     devServer
//   },
//   // For use in <script> tags
//   {
//     node,
//     module: moduleConfig,
//     output: {
//       path: outputPath,
//       filename: "itkVtkViewerCDN.js",
//       publicPath: cdnPath
//     },
//     resolve: {
//       modules: [path.resolve(__dirname, "node_modules")],
//       alias: {
//         "./itkConfig$": path.resolve(__dirname, "src", "itkConfigCDN.js")
//       }
//     },
//     performance,
//     devServer
//   }
// ];
