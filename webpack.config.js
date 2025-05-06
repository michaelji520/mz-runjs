const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
// For PWA
// const WebpackPwaManifest  = require('webpack-pwa-manifest');
// const WorkboxPlugin = require('workbox-webpack-plugin');
// end of PWA

const isDev = process.env.NODE_ENV === "development";

// const WorkboxGenerateSW = new WorkboxPlugin.GenerateSW({
//       // attempt to identify and delete any precaches created by older, incompatible versions.
//       cleanupOutdatedCaches: true,
//       maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 5MB

//       // Define runtime caching rules.
//       runtimeCaching: [{
//         // Match any request that ends with .png, .jpg, .jpeg or .svg.
//         urlPattern: /\.(?:jpg|jpeg|svg|png)$/,
//         // Apply a cache-first strategy.
//         handler: 'CacheFirst',
//         options: {
//           // Use a custom cache name.
//           cacheName: 'images',
//           // Only cache 10 images.
//           expiration: { maxEntries: 10 },
//         },
//       }],
//     })
// if (isDev) {
//   Object.defineProperty(WorkboxGenerateSW, 'alreadyCalled', {
//     get() {
//       return false
//     },
//     set() {}
//   })
// }

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    index: {
      import: path.resolve(__dirname, "./src/main.tsx"),
      filename: "[name].[hash:8].js",
    },
    "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
    "ts.worker": "monaco-editor/esm/vs/language/typescript/ts.worker",
  },
  output: {
    globalObject: "self",
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader" },
          { loader: "postcss-loader" },
          {
            loader: "less-loader",
            options: { lessOptions: { strictMath: true } },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(ttf|woff2?)$/,
        use: ["file-loader"],
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        use: { loader: "swc-loader" },
      },
      {
        test: /\.(svg|png|jpe?g|gif)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/[hash][ext]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "index",
      filename: "index.html",
      favicon: path.resolve(__dirname, "./src/assets/favicon.ico"),
      template: path.resolve(__dirname, "./src/index.html"),
      chunks: ["index"],
      inject: true,
      minify: { collapseWhitespace: true },
    }),
    new CompressionWebpackPlugin({
      test: /\.js$|\.html$|\.css$/u,
      // compress if file is larger than 4kb
      threshold: 4096,
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, "./src/manifest.json"),
    //       to: path.resolve(__dirname, "./dist/manifest.json"),
    //     },
    //     {
    //       from: path.resolve(__dirname, "./src/assets/"),
    //       to: path.resolve(__dirname, "./dist"),
    //     },
    //   ],
    // }),
    new CssMinimizerWebpackPlugin({
      test: /\.css$/g,
    }),
    new MiniCssExtractPlugin(),
    new MonacoWebpackPlugin(),
    isDev ? false : new CleanWebpackPlugin(),
    // new WebpackPwaManifest({
    //   filename: 'manifest.webmanifest',
    //   name: 'mz-runjs',
    //   short_name: 'mz-runjs',
    //   display: 'fullscreen',
    //   description: 'This application is a web-based JavaScript editor and runner.',
    //   background_color: '#ccc',
    //   theme_color: '#ccc',
    //   start_url: "/?from=pwa",
    //   orientation: 'landscape', // portrait
    //   crossorigin: null, //can be null, use-credentials or anonymous
    //   // need to add follow line, cause plugin set publicPath 'auto' as default value
    //   publicPath: '/' ,
    //   icons: [
    //     {
    //       src: path.resolve(__dirname, './src/assets/icon.png'),
    //       // auto generate multiple size icon, at lease have 192 size
    //       sizes: [64, 128, 192, 256] // multiple sizes
    //     }
    //   ]
    // }),
    // isDev ? false : WorkboxGenerateSW
  ].filter(Boolean),
};