const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');


module.exports = {
    mode: 'production',

    entry: './src/main',

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },

    optimization: {
        minimizer: [
            new TerserWebpackPlugin({
                parallel: true,
                terserOptions: {
                    ecma: 6
                }
            })
        ]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },

    devServer: {
        host: '0.0.0.0',
        compress: true,
        port: 8100,
        disableHostCheck: true,
        overlay: true,
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/main.ejs',
            templateParameters: (compilation, assets, assetTags, options) => {
                return {
                    compilation,
                    webpackConfig: compilation.options,
                    htmlWebpackPlugin: {
                        tags: assetTags,
                        files: assets,
                        options
                    },
                    reactJs: `js/react.min.js`,
                    reactDomJs: `js/react-dom.min.js`,
                };
            },
        }),
        new CopyWebpackPlugin([
            {
                from: `node_modules/react/umd/react.development.js`,
                to: `js/react.min.js`,
            },
            {
                from: `node_modules/react-dom/umd/react-dom.development.js`,
                to: `js/react-dom.min.js`,
            },
        ]),
    ],
};
