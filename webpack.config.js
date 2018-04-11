const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode: 'development',
    entry: 'index.js',
    resolve: {
        modules: [
            'node_modules',
            'browser'
        ]
    },
    module: {
        rules: [
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin()
    ]
}