var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

 module.exports = {
     entry: {
         map:'./js/map.js',
         // leaflet:'./node_modules/leaflet/dist/leaflet.css'
     },
     // resolve: {
     //    modulesDirectories: ['node_modules'],
     //    extensions: ['', '.js', '.jsx', '.css']
     // },
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: '[name].bundle.js'
     },
     module: {
        //  loaders: [{
        //     test: /\.jsx?$/,
        //     exclude: /node_modules/,
        //     loader: 'babel-loader'
        // }, {
        //     test: /\.css$/,
        //     loader: "style-loader!css-loader"
        // }, {
        //     test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        //     loader: 'file-loader'
        // }],
         rules: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 exclude: /node_modules/,
                 query: {
                     presets: ['es2015']
                 }
             },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/, loader: 'file-loader'}
        ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
 };
