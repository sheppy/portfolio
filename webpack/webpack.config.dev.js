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
const WebpackIsomorphicToolsPlugin = require("webpack-isomorphic-tools/plugin");
const PATHS = require("./paths");
const commonConfig = require("./webpack.common");
const webpackIsomorphicToolsConfig = require("./webpack-isomorphic-tools");

const IS_PROD = process.env.NODE_ENV === "production";
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(webpackIsomorphicToolsConfig);


console.info(`💡 Webpack: Development - env="${process.env.NODE_ENV}"`);

const devConfig = {
    devtool: "cheap-module-source-map",

    entry: {
        app: [
            "webpack-dev-server/client?http://127.0.0.1:8080/",
            "webpack/hot/only-dev-server"
        ]
    },

    output: {
        publicPath: "http://127.0.0.1:8080/"
    },

    performance: false,

    plugins: [
        new webpack.HotModuleReplacementPlugin({ multiStep: true }),
        webpackIsomorphicToolsPlugin.development()
    ],

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
                use: [
                    "style-loader",
                    "css-loader?modules&importLoaders=1&camelCase&localIdentName=[name]_[local]_[hash:base64:5]!postcss-loader"
                ]
            }
        ]
    },

    watchOptions: {
        // Delay the rebuild after the first change
        aggregateTimeout: 300,
        // Poll using interval (in ms, accepts boolean too)
        poll: 1000
    },

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


module.exports = merge([
    commonConfig,
    devConfig
]);
