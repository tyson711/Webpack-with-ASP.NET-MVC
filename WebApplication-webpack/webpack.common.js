const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BomPlugin = require('webpack-utf8-bom') // 將文件轉為 utf-8 bom 格式，解決中文亂碼問題
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const exposeLoader = path.resolve(__dirname, 'node_modules/expose-loader/index.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
const SpritesmithPlugin = require('webpack-spritesmith')
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const { npm_lifecycle_event } = process.env

/**
 * @class getEntry
 * @description 動態分析 Containers 入口文件並打包
 */
const getEntry = function() {
  var Files = glob.sync(path.join(__dirname, 'Resource/Containers/*/Index.js'))
  var Entries = {}
  Files.forEach(function(f) {
    var name = /.*\/(Containers\/.*?)\.js/.exec(f)[1].split('/')[1]
    Entries[name] ? Entries[name].push(f) : (Entries[name] = [f])
  })
  return Entries
}

/**
 * @class SetHtmlWebpackPlugin
 * @description 動態生成 CSHTML 頁面，並引入該頁相關 Bundle 檔案
 */
setHtmlTemplates = function() {
  var TargetPage = glob.sync('Views/*/')
  var JsTemplatePath = 'Views/BundleTemp/_Js_Bundle.cshtml'
  var CssTemplatePath = 'Views/BundleTemp/_Css_Bundle.cshtml'
  var getPath = FileName => './../../Views/Bundle/_' + FileName + '.bundle.cshtml'
  TargetPage.forEach(filePath => {
    var BundleName = filePath.split('/')[1]
    if (BundleName === 'BundleTemp' || BundleName === 'Bundle' || BundleName === 'Shared') return false
    var JsFileNamePath = getPath(BundleName + '_Js')
    var CssFileNamePath = getPath(BundleName + '_Css')
    CommonConfig.plugins.push(
      new HtmlWebpackPlugin({
        template: JsTemplatePath,
        filename: JsFileNamePath,
        chunks: ['Runtime', 'Commons', BundleName],
        inject: false,
        isDefer: false,
      })
    )
    CommonConfig.plugins.push(
      new HtmlWebpackPlugin({
        template: CssTemplatePath,
        filename: CssFileNamePath,
        chunks: ['Commons', BundleName],
        inject: false,
      })
    )
  })
  CommonConfig.plugins.push(new InlineManifestWebpackPlugin())
}

let CommonConfig = {
  entry: getEntry(),
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          name: 'Commons',
          chunks: 'initial',
          minChunks: 3,
        },
      },
    },
    runtimeChunk: { name: 'Runtime' },
    namedModules: true,
    noEmitOnErrors: true,
    concatenateModules: true,
  },
  resolve: {
    modules: [path.join(__dirname, 'Resource'), path.join(__dirname, 'node_modules')],
    alias: {
      '@Resource': path.join(__dirname, 'Resource'),
      '@Containers': path.join(__dirname, 'Resource/Containers'),
      '@Components': path.join(__dirname, 'Resource/Components'),
      '@Scripts': path.join(__dirname, 'Scripts'),
      jquery$:
        exposeLoader +
        '?$!' +
        exposeLoader +
        '?jQuery!' +
        path.join(__dirname, 'node_modules/jquery/dist/jquery.js-exposed'),
      react$: exposeLoader + '?React!' + path.join(__dirname, 'node_modules/react/index.js-exposed'),
      'react-dom$': exposeLoader + '?ReactDOM!' + path.join(__dirname, 'node_modules/react-dom/index.js-exposed'),
      reflux$: exposeLoader + '?Reflux!' + path.join(__dirname, 'node_modules/reflux/src/index.js-exposed'),
      fingerprint2:
        exposeLoader +
        '?Fingerprint2!' +
        path.join(__dirname, 'node_modules/fingerprintjs2/dist/fingerprint2.min.js-exposed'),
      lodash$:
        exposeLoader +
        '?_!' +
        exposeLoader +
        '?lodash!' +
        path.join(__dirname, 'node_modules/lodash/lodash.js-exposed'),
      firebase$: exposeLoader + '?firebase!' + path.join(__dirname, 'node_modules/firebase/dist/index.cjs.js-exposed'),
      moment$: exposeLoader + '?moment!' + path.join(__dirname, 'node_modules/moment/moment.js-exposed'),
      utilityJS: path.join(__dirname, 'Resource/Components/Utility/Utility'),
    },
    extensions: ['.js', '.jsx', '.css', '.scss', '.sass'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, 'Resource'),
        exclude: /node_modules/,
        use: [
          {
            loader: 'happypack/loader',
            options: {
              id: 'bundleJS',
            },
          },
        ],
      },
      {
        test: /\.(css|scss)$/,
        include: path.join(__dirname, 'Resource'),
        exclude: [/node_modules/],
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'happypack/loader',
            options: {
              id: 'bundleCSS',
            },
          },
        ],
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ejs-loader',
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 3000,
              name: '/Images/[name]-[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '/Fonts/[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HappyPack({
      id: 'bundleJS',
      loaders: [
        {
          loader: 'babel-loader',
          query: {
            cacheDirectory: './Resource/Webpack_cache/',
          },
        },
      ],
      threadPool: happyThreadPool,
      cache: true,
      verbose: true,
    }),
    new HappyPack({
      id: 'bundleCSS',
      loaders: [
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            modules: true,
            localIdentName: '[name]_[local]-[hash:base64:5]',
            // minimize: true,
            // importLoaders: 1,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
      threadPool: happyThreadPool,
      cache: true,
      verbose: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'Css/[name].css',
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new BomPlugin(true, /\.(cshtml)$/), // 避免 cshtml 出現亂碼
    new FriendlyErrorsWebpackPlugin(),
  ],
  stats: {
    timings: true,
    version: true,
    performance: true,
    colors: true,
  },
}
if (npm_lifecycle_event !== 'dev:js') {
  // 產生 Bundle HTML
  setHtmlTemplates()
  // 產生雪碧圖
  CommonConfig.plugins.push(
    new SpritesmithPlugin({
      src: {
        cwd: path.join(__dirname, 'Resource/Images/sprite'),
        glob: '*',
      },
      target: {
        image: path.join(__dirname, 'Resource/Images/sprite.png'),
        css: path.join(__dirname, 'Resource/Sass/_theme/_sprite.scss'),
      },
      spritesmithOptions: {
        padding: 10,
      },
      apiOptions: {
        cssImageRef: '../Images/sprite.png',
      },
      // retina: '@2x',
    })
  )
}
module.exports = CommonConfig
