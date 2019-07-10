const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const APP_DIR = path.resolve(__dirname, './src');
const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');

module.exports = {
  plugins: [
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ['json']
    })
  ],
  entry: {
    app: './src/app.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: APP_DIR,
        use: [{
          loader: 'style-loader'
        }, {
          loader: 'css-loader'
        }]
      }, {
        test: /\.css$/,
        include: MONACO_DIR,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        query: {
          presets: ['es2017']
        }
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './')
  },
  // mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'  // eslint-disable-line
  mode: 'development'  // eslint-disable-line
};
