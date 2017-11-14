var path = require('path');
var webpack = require('webpack');

 module.exports = {
     entry: {
         main:'./js/main.js',
         // leaflet:'./js/leaflet.js',
         map:'./js/map.js'
     },
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: '[name].bundle.js'
     },
     module: {
         loaders: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['es2015']
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
 };
