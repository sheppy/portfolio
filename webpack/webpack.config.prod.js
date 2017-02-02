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

const webpack = require("webpack");
const merge = require("webpack-merge");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const OptimizeJsPlugin = require("optimize-js-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpackIsomorphicToolsConfig = require("./webpack-isomorphic-tools");
const WebpackIsomorphicToolsPlugin = require("webpack-isomorphic-tools/plugin");
const PATHS = require("./paths");
const commonConfig = require("./webpack.common");


const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(webpackIsomorphicToolsConfig);


console.info(`💡 Webpack: Production - env="${process.env.NODE_ENV}"`);

const prodConfig = {
    devtool: "source-map" ,

    output: {
        publicPath: "/"
    },

    performance: {
        maxAssetSize: 250000,
        maxEntrypointSize: 250000,
        hints: "warning"
    },

    plugins: [
        new CleanWebpackPlugin([PATHS.BUILD], {
            root: PATHS.ROOT,
            verbose: true,
            dry: false,
            exclude: [".gitkeep"]
        }),
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
    ],

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
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
                use: ExtractTextPlugin.extract({
                    fallbackLoader: "style-loader",
                    loader: "css-loader?modules&importLoaders=1&camelCase&localIdentName=[name]_[local]_[hash:base64:5]!postcss-loader"
                })
            }
        ]
    }
};


module.exports = merge([
    commonConfig,
    prodConfig
]);
