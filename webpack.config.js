const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const WebpackProvideGlobalPlugin=require('webpack-provide-global-plugin');
var webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
// This is main configuration object.
// Here you write different options and tell Webpack what to do
module.exports = {

  //watch: true,
    cache: true,
  // Path to your entry point. From this file Webpack will begin his work
  entry: {
          //login:'./app/js/login.js',
          //principal:'./app/js/principal.js',
          //expediente:'./app/js/expediente.js',
          index:'./app/js/index.js',
          //visor:'./app/js/visor.js'
  	    },

  // Path and filename of your result bundle.
  // Webpack will bundle all JavaScript into this file
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    //publicPath: "/bienes-raices"
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    hot: true,
    watchContentBase: true,
    disableHostCheck: true,
    historyApiFallback: true,
  },


  module: {
    rules: [
        {test: /\.css?$/,include: /node_modules/,  loaders: ['style-loader', 'css-loader']},
        {
            test: /\.scss?$/,
            
          use: [

              MiniCSSExtractPlugin.loader,
              {
                loader: 'css-loader',
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


        },
        
      { test: /\.json$/, type: 'javascript/auto', loader: 'json-loader' },
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.jsx?$/,  
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"]
            }
          }
        ],

      },{
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url-loader?limit=10000&mimetype=application/font-woff'
        },
        {
          test: /\.(ttf|otf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?|(jpg|gif)$/,
          loader: "file-loader?name=img/[name].[ext]"
        },
        {test: /\.(png|jpg)$/, loader: "file-loader?name=img/[name].[ext]"}
    ]
  },
  plugins: [
  /*
    new HtmlWebpackPlugin({  
        filename: './html/login.html',
        template: './app/html/login.html',
        append: false,
        chunks: ["login"]
      }),
      new HtmlWebpackPlugin({  
        filename: './html/principal.html',
        template: './app/html/principal.html',
        chunks: ["principal"]
      }),
      new HtmlWebpackPlugin({  
        filename: './html/expedientes.html',
        template: './app/html/expedientes.html',
        chunks: ["expediente"]
      }),
      */
      new HtmlWebpackPlugin({  
        filename: './index.html',
        template: './app/index.html',
        chunks: ["index"]
      }),
    /*
      new HtmlWebpackPlugin({  
        filename: './html/visor.html',
        template: './app/html/visor.html',
        chunks: ["visor"]
      }),
      */
      new MiniCSSExtractPlugin({
        filename: 'css/[name].css',
        template: './app/css/styles.scss'
      }),
      new CompressionPlugin()
  ],
  node: {
    fs: "empty"
  },

  // Default mode for Webpack is production.
  // Depending on mode Webpack will apply different things
  // on final bundle. For now we don't need production's JavaScript 
  // minifying and other thing so let's set mode to development
  mode: 'production'
};