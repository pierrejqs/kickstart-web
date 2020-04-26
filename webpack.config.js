const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const devMode = argv.mode !== 'production';

  return {
    devtool: 'source-map',
    entry: {
      app: ['./src/assets/scss/app.scss', './src/assets/js/app.js'],
    },
    watch: devMode,
    output: {
      path: path.resolve('./dist/'),
      // filename: devMode ? '[name].js' : '[name].[chunkhash].js',
      filename: '[name].[hash].js',
      // publicPath: '/',
    },

    devServer: {
      overlay: true,
      contentBase: path.resolve('./src'),
      disableHostCheck: true,
    },

    plugins: [
      new HtmlWebpackPlugin({
        title: 'Custom template',
        // Load a custom template (lodash by default)
        template: 'src/index.html',
        filename: 'index.html',
        meta: {
          viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
          'theme-color': '#4285f4',
          // Will generate: <meta name="theme-color" content="#4285f4">
        },
      }),
      new MiniCssExtractPlugin({
        // filename: devMode ? '[name].css' : '[name].[hash].css',
        filename: 'assets/[name].[hash].css',
      }),
      new CleanWebpackPlugin(),
      new ManifestPlugin(),
    ],

    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'eslint-loader',
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
        },
        {
          test: /\.scss$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            // Creates `style` nodes from JS strings
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // only enable hot in development
                hmr: !!devMode,
                // if hmr does not work, this is a forceful method.
                reloadAll: true,
              },
            },
            // Translates CSS into CommonJS
            'css-loader',
            'postcss-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        },
        {
          test: /\.(woff2?|eot|ttf|otf|)(\?.*)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: devMode ? '[name].[ext]' : '[name].[hash].[ext]',
                publicPath: '../assets/fonts',
                outputPath: './fonts/',
              },
            },
          ],
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                name: devMode ? '[name].[ext]' : '[name].[hash].[ext]',
                // publicPath: './dist/assets/images',
                outputPath: './images/',
                publicPath: '../assets/images',

              },

            },
            {
              loader: 'img-loader',
              options: {
                plugins: [
                  require('imagemin-gifsicle')({
                    interlaced: false,
                  }),
                  require('imagemin-mozjpeg')({
                    progressive: true,
                    arithmetic: false,
                  }),
                  require('imagemin-pngquant')({
                    floyd: 0.5,
                    speed: 2,
                  }),
                  require('imagemin-svgo')({
                    plugins: [
                      { removeTitle: true },
                      { convertPathData: false },
                    ],
                  }),
                ],
                name: devMode ? '[name].[ext]' : '[name].[hash].[ext]',
                publicPath: '../images',
                outputPath: './images/',
              },
            },
          ],
        },

      ],
    },

    optimization: {
      minimizer: [new UglifyJsPlugin()],
    },

  };
};
