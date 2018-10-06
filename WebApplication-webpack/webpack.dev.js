const webpack = require('webpack')
const path = require('path')
const Merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const CommonConfig = require('./webpack.common.js')
const { npm_lifecycle_event } = process.env

if (npm_lifecycle_event === 'lint') {
  CommonConfig.module.rules.push({
    test: /\.(js|jsx)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    exclude: [/node_modules/, path.join(__dirname, 'Scripts/lib')],
    options: {
      // fix: true,
    },
  })
}
if (npm_lifecycle_event === 'dev') {
  CommonConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
}
if (npm_lifecycle_event === 'dev:analyzer') {
  CommonConfig.plugins.push(new BundleAnalyzerPlugin())
}
module.exports = Merge(CommonConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    filename: '[name].js',
    // chunkFilename: '[id].js',
    path: path.join(__dirname, 'Resource/__BundleDev__'),
    publicPath: '/Resource/__BundleDev__',
    library: 'Components',
  },
  plugins: [
    new CleanWebpackPlugin(['Resource/__BundleDev__'], {
      verbose: true,
    }),
    new ErrorOverlayPlugin(),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./Resource/__VendorDev__/Vendor_manifest.json'),
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'Resource/Bundle'),
    clientLogLevel: 'warning',
    overlay: {
      warnings: true,
      errors: true,
    },
    historyApiFallback: true,
    hot: true,
    port: 7777,
    open: true,
    index: '',
    proxy: [
      {
        context: () => true,
        target: 'http://localhost:54995',
      },
    ],
  },
})
