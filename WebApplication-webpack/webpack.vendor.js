const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const SMP = new SpeedMeasurePlugin()
const { npm_lifecycle_event } = process.env
const isProduction = npm_lifecycle_event === 'build'
const vendorFolder = isProduction ? 'Vendor' : '__VendorDev__'
/**
 * @class SetHtmlWebpackPlugin
 * @description 動態生成 CSHTML 頁面，並引入 Shared 相關 Bundle 檔案
 */
setHtmlTemplates = function() {
  vendorConfig.plugins.push(
    new HtmlWebpackPlugin({
      template: 'Views/BundleTemp/_Js_Bundle.cshtml',
      filename: './../../Views/Bundle/_Shared_Js.bundle.cshtml',
      chunks: ['Vendor'],
      inject: false,
      isDefer: false,
    })
  )
}
let vendorConfig = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'nosources-source-map' : 'inline-source-map',
  optimization: {
    minimizer: [new UglifyJsPlugin({ sourceMap: true })],
  },
  entry: {
    Vendor: [
      'expose-loader?$!expose-loader?jQuery!jquery',
      'expose-loader?React!react',
      'expose-loader?ReactDOM!react-dom',
      'expose-loader?Reflux!reflux',
      'expose-loader?_!expose-loader?lodash!lodash',
      'expose-loader?Fingerprint2!fingerprintjs2',
      'expose-loader?moment!moment',
    ],
  },
  output: {
    filename: '[name].dll.js',
    path: path.join(__dirname, 'Resource/', vendorFolder),
    publicPath: '/Resource/' + vendorFolder,
    library: '[name]_dll',
  },
  plugins: [
    new CleanWebpackPlugin(['Resource/' + vendorFolder], {
      verbose: true,
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DllPlugin({
      context: __dirname,
      name: '[name]_dll',
      path: path.join(__dirname, 'Resource/' + vendorFolder + '/[name]_manifest.json'),
    }),
  ],
  stats: {
    timings: true,
    version: true,
    performance: true,
    colors: true,
  },
}
setHtmlTemplates()
if (npm_lifecycle_event === 'vendor:analyzer') {
  vendorConfig.plugins.push(new BundleAnalyzerPlugin())
}
module.exports = SMP.wrap(vendorConfig)
