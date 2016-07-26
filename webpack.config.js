var path = require('path');
var webpack = require('webpack');
var precss = require('precss');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
    ],
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loaders: ['babel'],
                exclude: /(node_modules)/,
                include: __dirname,
            },

            {
                test: /\.css$/,
                loaders: ['style', 'css?root=.', 'postcss'],
                // exclude: /(node_modules)/,
                include: __dirname,
            },

            {
                test: /\.less/,
                loaders: ['style', 'css?root=.', 'postcss', 'less'],
                // exclude: /(node_modules)/,
                include: __dirname,
            },

            {
                test: /\.(jpg|jpeg|png|gif|svg|woff|woff2|ttf|eot)$/,
                loader: 'url-loader',
                // exclude: /(node_modules)/,
                include: __dirname,
            },
        ],
    },
    postcss: function() {
        return [precss];
    },
    entry: [
        'webpack-hot-middleware/client?reload=true',
        './src/index.js',
    ],
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: 'index.js',
        sourceMapFilename: '[file].map',
    },
};
