const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    index: {
      import: path.resolve(__dirname, "./src/main.tsx"),
      filename: "[name].js",
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
  ].filter(Boolean),
};