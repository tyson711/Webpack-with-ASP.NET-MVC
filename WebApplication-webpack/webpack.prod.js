const webpack = require('webpack')
const path = require('path')
const Merge = require('webpack-merge')
const CommonConfig = require('./webpack.common.js')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { npm_lifecycle_event } = process.env
if (npm_lifecycle_event === 'build:analyzer') {
  CommonConfig.plugins.push(new BundleAnalyzerPlugin())
}
module.exports = Merge(CommonConfig, {
  mode: 'production',
  devtool: 'nosources-source-map',
  output: {
    filename: '[name].js',
    // chunkFilename: '[id].js',
    path: path.join(__dirname, 'Resource/Bundle'),
    publicPath: '/Resource/Bundle',
    library: 'Components',
  },
  plugins: [
    new CleanWebpackPlugin(['Resource/Bundle'], {
      verbose: true,
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./Resource/Vendor/Vendor_manifest.json'),
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          beautify: false,
          comments: false,
          mangle: false,
          toplevel: false,
          sourceMap: true,
          cache: true,
          keep_classnames: true,
          keep_fnames: true,
          // compress: true,
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
})
