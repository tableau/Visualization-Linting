const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = {
  plugins: [
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      features: ["!gotoSymbol"],
      languages: ['json'],
    }),
  ],
  entry: {
    app: './src/app.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {plugins: [require('autoprefixer')]},
          },
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        query: {
          presets: ['es2017'],
        },
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './'),
  },
  // mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'  // eslint-disable-line
  mode: 'development', // eslint-disable-line
};
