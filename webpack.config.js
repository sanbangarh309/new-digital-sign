const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackVisualizerPlugin = require('webpack-visualizer-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

module.exports = (env, argv) => {
    /* Use webpack mode or NODE_ENV to set devMode, default development. */
    const mode = 'development';//argv.mode || process.env.NODE_ENV || 'development';
    const devMode = mode === 'development';//'development';

    const config = {
        mode: mode,
        context: path.resolve(__dirname, 'client'),
        devtool: devMode ? 'eval-source-map' : false,
        entry: {
            /* Define the entry point 'app' to our main js file. */
            app: [
                'babel-polyfill',
                path.resolve(__dirname, 'client/js/index.js')
            ].concat(devMode ? [hotMiddlewareScript] : []),
        },
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.css', '.scss', 'sass'],
            alias: {
                'stylesheet': path.resolve(__dirname, 'client/stylesheet'),
                'src': path.resolve(__dirname, 'client/js'),
            },
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'js/[name].js',
            chunkFilename: 'js/[id].js',
            publicPath: '/',
        },

        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: ['react', 'env', 'stage-0'],
                        plugins: [
                            'react-html-attrs',
                            'transform-class-properties',
                            'transform-decorators-legacy',
                        ].concat(devMode ? [
                            'react-hot-loader/babel',
                        ] : []),
                    },
                },
                { /* All stylesheet files */
                    test: /\.(css|sass|scss)$/,
                    use: [
                        /* HMR support is not ready, only use it in production mode */
                        devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                sourceMap: devMode ? true : false,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: devMode ? true : false,
                                plugins: () => [autoprefixer],
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: devMode ? true : false,
                            },
                        },
                    ],
                },
                { test: /\.(png|jpg|gif|jpeg|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader' }
            ],
        },

        optimization: {
            minimize: true,
            minimizer: [
                new UglifyJsPlugin({
                    sourceMap: false,
                    cache: true,
                    parallel: true,
                    uglifyOptions: {
                        compress: false,
                        minimize: true,
                        ecma: 6,
                        mangle: true,
                        output: {
                            comments: devMode ? true : false,
                        },
                    },
                }),
                new OptimizeCSSAssetsPlugin({}),
            ],
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'async',
                        name: 'vendor',
                        priority: -10,
                        enforce: true,
                    },
                    react: {
                        test: /react/,
                        chunks: 'initial',
                        name: 'react',
                        priority: 20,
                        enforce: true,
                    },
                    redux: {
                        test: /redux/,
                        chunks: 'initial',
                        name: 'redux',
                        priority: 20,
                        enforce: true,
                    },
                },
            },
            runtimeChunk: true,
        },

        plugins: [
            new webpack.DefinePlugin({
                __DEV__: JSON.stringify(devMode),
                 'process.browser': 'true'
            }),

            new CleanWebpackPlugin('dist', {} ),

            new CopyWebpackPlugin([{
                from: path.resolve(__dirname, 'client/public'),
            }]),

            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'client/public/index.html'),
                inject: 'body',
                minify: {
                    collapseWhitespace: true,
                    collapseInlineTagWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                },
            }),

            new MiniCssExtractPlugin({
                filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
                chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash].css',
            }),
            new webpack.ProvidePlugin({
                jQuery: 'jquery',
                $: 'jquery',
                jquery: 'jquery',
                'window.jQuery': 'jquery'
            })
        ].concat(devMode ? [
            /* HMR plugins */
            new webpack.HotModuleReplacementPlugin(),
            /* Chunk visualizer */
            new WebpackVisualizerPlugin(),
        ] : []),

        devServer: {
            disableHostCheck: true,
            host: '0.0.0.0',
            hot: true,
        },
    };

    return config;
};
