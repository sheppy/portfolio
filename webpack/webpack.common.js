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
const SplitByPathPlugin = require("webpack-split-by-path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PATHS = require("./paths");


const commonConfig = {
    cache: true,

    context: PATHS.ROOT,

    entry: {
        app: [
            "babel-polyfill",
            PATHS.APP
        ]
    },

    output: {
        path: PATHS.BUILD,
        filename: "[name].[hash].js",
        chunkFilename: "[id].[chunkhash].js",
        sourceMapFilename: "[file].map"
    },

    resolve: {
        modules: [
            "node_modules",
            PATHS.SRC
        ],
        extensions: [".js", ".jsx"]
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
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
    ]
};


module.exports = commonConfig;
