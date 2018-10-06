const path = require('path')
module.exports = {
  webpackConfig: {
    resolve: {
      modules: [path.join(__dirname, 'Resource'), path.join(__dirname, 'node_modules')],
      alias: {
        '@Resource': path.join(__dirname, 'Resource'),
        '@Containers': path.join(__dirname, 'Resource/Containers'),
        '@Components': path.join(__dirname, 'Resource/Components'),
        '@Scripts': path.join(__dirname, 'Scripts'),
      },
      extensions: ['.js', '.jsx', '.css', '.scss', '.sass'],
    },
    module: {
      rules: [
        {
          test: /\.js|jsx?$/,
          exclude: /node_modules/,
          loader: [
            {
              loader: 'babel-loader',
            },
          ],
        },
        {
          test: /\.(css|scss|sass)$/,
          include: path.join(__dirname, 'Resource'),
          exclude: [/node_modules/],
          loader: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]_[local]-[hash:base64:5]',
              },
            },
            {
              loader: 'sass-loader',
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
      ],
    },
  },
  title: 'React Style Guide',
  components: 'Resource/Components/**/*.js',
  require: [path.join(__dirname, 'Resource/Sass/n-index.scss'), path.join(__dirname, 'Resource/Sass/n-member.scss')],
}
