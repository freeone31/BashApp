var path = require('path');

module.exports = {
    entry: './src/index.js',
    devtool: 'sourcemaps',
    output: {
        path: __dirname,
        filename: '../src/main/resources/static/bundle.js'
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, '.'),
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react', 'env', 'es2016']
                }
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
        ],
    },
};
