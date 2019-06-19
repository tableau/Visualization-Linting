const path = require('path');

module.exports = {
  entry: {
    app: './app.js'
  },
  module: {
    rules: [
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
