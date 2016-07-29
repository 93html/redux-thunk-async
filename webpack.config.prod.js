var path = require('path');
var webpack = require('webpack');

module.exports = {
    // devtool: 'cheap-module-eval-source-map',
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({minimize: true}),
    ],
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loaders: ['babel'],
                exclude: /(node_modules)/,
                include: __dirname,
            },

        ],
    },
    entry: [
        './src/index.js',
    ],
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: 'index.js',
        // sourceMapFilename: '[file].map',
    },
};
