import webpack from 'webpack';
import path from 'path';
import AssetsPlugin from 'assets-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import FlowWebpackPlugin from 'flow-status-webpack-plugin';
import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import EslintPlugin from 'webpack-eslint-plugin';

export default(env) => {
    const {shouldAnalyze, isHot, disableAssetsPlugin, disableLinting} = env || {};

    const vendor = [
        'react/',
        'react-dom/',
        'redux/',
        'apollo-client/',
        'react-redux/',
        'react-apollo/',
        'semantic-ui-react/',
        'lodash/',
        'lodash-es/',
        'whatwg-fetch/',
        'graphql-tag/',
        'graphql/',
        'graphql-anywhere/',
        'fbjs/'
    ];

    const vendorRegex = new RegExp(`/(${vendor.join('|')})`);
    const namedArgs = process.argv.reduce((o, v) => {
        const arg = v.split('=');
        o[arg[0]] = arg[1] || true;
        return o;
    }, {});

    process.env.NODE_ENV = '--optimize-minimize' in namedArgs ? 'production' : 'development';


    const ASSET_PATH = process.env.ASSET_PATH || '/assets/compiled/';
    const NODE_ENV = process.env.NODE_ENV || 'development';
    const IS_PROD = NODE_ENV === 'production';

    const CSS_BUNDLE_FILE = IS_PROD ? '[chunkhash].[name].css' : '[name].css';

    const extractCss = new ExtractTextPlugin({
        filename: CSS_BUNDLE_FILE
    });

    const plugins = [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            minChunks: (module) => {
                if (module.resource) {
                    return vendorRegex.test(module.resource);
                }
                return false;
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {NODE_ENV: JSON.stringify(NODE_ENV), ASSET_PATH: JSON.stringify(ASSET_PATH)}
        })
    ];

    if (!disableLinting) {
        plugins.push(new FlowWebpackPlugin({
            binaryPath: 'node_modules/.bin/flow',
            onSuccess: console.log,
            onError: console.error
        }));
        plugins.push(new EslintPlugin());
    }

    if (!disableAssetsPlugin) {
        plugins.push(new AssetsPlugin({filename: 'conf/webpack-assets.json'}));
    }

    if (shouldAnalyze) {
        plugins.push(new BundleAnalyzerPlugin());
    }

    plugins.push(extractCss);

    if (IS_PROD) {
        plugins.push(
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true
                },
                sourceMap: true,
                output: {
                    comments: false
                }
            })
        );
    }

    let mainEntry = [];
    const loaders = [
        {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: 'babel-loader'
        }
    ];

    if (isHot) {
        plugins.push(new webpack.NamedModulesPlugin());
        mainEntry = [
            'react-hot-loader/patch',
            'webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/only-dev-server',
            'main.hot.js'
        ];
    } else {
        mainEntry.push('main.js');
    }

    if (isHot) {
        loaders.push({
                test: /\.scss$/,
                use: [
                    'style-loader?sourceMap=true',
                    'css-loader?sourceMap=true&localIdentName=[name]_[local]_[hash:base64:5]&importLoaders=1!postcss-loader',
                    'postcss-loader',
                    `sass-loader?outputStyle=expanded&sourceMap=true&sourceMapContents=true`
                ]
            },
            {
                test: /\.css/,
                use: [
                    'style-loader?sourceMap=true',
                    'css-loader?sourceMap=true'
                ]
            });
    } else {
        loaders.push({
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        'css-loader?sourceMap=true&localIdentName=[name]_[local]_[hash:base64:5]&importLoaders=1!postcss-loader',
                        'postcss-loader',
                        `sass-loader?outputStyle=expanded&sourceMap=true&sourceMapContents=true`
                    ]
                })
            },
            {
                test: /\.css/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        'css-loader'
                    ]
                })
            });
    }

    const outputPath = path.join(__dirname, '../public/compiled');

    const setup = {
        devtool: IS_PROD ? false : 'eval-source-map',
        resolve: {
            modules: [
                path.resolve('./assets/js/entries'),
                'node_modules'
            ]
        },
        entry: {
            main: mainEntry,
            server: 'server.js',
            'server-polyfills': 'server-polyfills.js'
        },
        output: {
            publicPath: isHot ? `http://localhost:8080${ASSET_PATH}` : ASSET_PATH,
            path: outputPath,
            filename: IS_PROD ? '[chunkhash].[name].js' : '[name].js'
        },
        module: {
            loaders
        },
        plugins
    };

    if (isHot) {
        setup.devServer = {
            // enable HMR on the server
            contentBase: ASSET_PATH,
            // match the output path
            publicPath: ASSET_PATH,
            // match the output `publicPath`
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        };
    }
    return setup;
};
