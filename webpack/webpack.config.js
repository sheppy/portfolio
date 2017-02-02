/**
 * @author Chris Sheppard <chris@chrissheppard.co.uk>
 *
 * @license
 * GPLv3Copyright (C) 2017 Chris Sheppard
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 */

"use strict";

const path = require("path");
const webpack = require("webpack");
const SplitByPathPlugin = require("webpack-split-by-path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeJsPlugin = require("optimize-js-plugin");
const webpackIsomorphicToolsConfig = require("./webpack-isomorphic-tools");
const WebpackIsomorphicToolsPlugin = require("webpack-isomorphic-tools/plugin");


const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(webpackIsomorphicToolsConfig);

const PATHS = {
    SRC: path.join(__dirname, "..", "src"),
    APP: path.join(__dirname, "..", "src", "client", "index.js"),
    BUILD: path.join(__dirname, "..", "build"),
    PUBLIC: path.join(__dirname, "..", "public"),
    NODE_MODULES: path.join(__dirname, "..", "node_modules")
};


module.exports = function () {
    const NODE_ENV = process.env.NODE_ENV;
    const IS_PROD = NODE_ENV === "production";

    console.info(`Webpack: Production=${IS_PROD}`);

    const plugins = [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new SplitByPathPlugin(
            [{
                name: "vendor",
                path: PATHS.NODE_MODULES
            }],
            { manifest: "vendor" }
        ),
        new webpack.NamedModulesPlugin(),
        new ExtractTextPlugin({ filename: "[name].[contenthash].css", allChunks: true })
    ];

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
                output: {
                    comments: false,
                },
            }),
            new OptimizeJsPlugin({ sourceMap: false }),
            webpackIsomorphicToolsPlugin
        );
    } else {
        plugins.push(
            new webpack.HotModuleReplacementPlugin({
                multiStep: true
            }),
            webpackIsomorphicToolsPlugin.development()
        );
    }


    return {
        cache: true,

        devtool: IS_PROD ? "source-map" : "cheap-module-source-map",

        context: path.resolve(__dirname, ".."),

        entry: {
            app: [
                // TODO: Dev only:
                "webpack-dev-server/client?http://127.0.0.1:8080/",
                "webpack/hot/only-dev-server",

                "babel-polyfill",
                PATHS.APP
            ],
        },

        output: {
            path: PATHS.BUILD,
            filename: "[name].[hash].js",
            chunkFilename: "[id].[chunkhash].js",
            sourceMapFilename: "[file].map",
            publicPath: IS_PROD ? "/" : "http://127.0.0.1:8080/"
        },

        resolve: {
            modules: [
                "node_modules",
                PATHS.SRC
            ],
            extensions: [".js", ".jsx"]
        },

        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: [
                        "react-hot-loader",
                        {
                            loader: "babel-loader",
                            query: {
                                cacheDirectory: true
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,

                    // TODO: Dev only
                    use: [
                        "style-loader",
                        "css-loader?modules&importLoaders=1&camelCase&localIdentName=[name]_[local]_[hash:base64:5]!postcss-loader"
                    ]

                    // TODO: Production
                    // use: ExtractTextPlugin.extract({
                    //     fallbackLoader: "style-loader",
                    //     loader: "css-loader?modules&importLoaders=1&camelCase&localIdentName=[name]_[local]_[hash:base64:5]!postcss-loader"
                    // })
                }
            ]
        },

        performance: IS_PROD && {
            maxAssetSize: 250000,
            maxEntrypointSize: 250000,
            hints: "warning"
        },

        plugins,

        watchOptions: {
            // Delay the rebuild after the first change
            aggregateTimeout: 300,
            // Poll using interval (in ms, accepts boolean too)
            poll: 1000
        },

        // TODO: Dev only?
        devServer: {
            contentBase: PATHS.PUBLIC,
            historyApiFallback: true,
            host: process.env.HOST,
            port: process.env.PORT,
            compress: IS_PROD,
            inline: !IS_PROD,
            hot: !IS_PROD,
            stats: {
                assets: true,
                children: false,
                chunks: false,
                hash: false,
                modules: false,
                publicPath: false,
                timings: true,
                version: false,
                warnings: true,
                colors: {
                    green: "\u001b[32m"
                }
            },
            proxy: {
                "*": `http://127.0.0.1:${process.env.PORT || 3000}`
            },
        }
    };
};
