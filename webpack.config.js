'use strict';

let path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/js/script.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist/js'
  },
  watch: true,

  devtool: "source-map",
  devServer: {  // configuration for webpack-dev-server
    contentBase: './',  //source of static assets
    port: 7700, // port to run dev-server
  }
};
