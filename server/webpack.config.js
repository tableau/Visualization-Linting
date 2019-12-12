const path = require('path');

module.exports = {
  entry: {
    app: './server.js',
  },
  module: {
    rules: [
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
  target: 'node',
  externals: {
    canvas: 'commonjs canvas', // Important (2)
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development', // eslint-disable-line
};
