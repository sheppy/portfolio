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

const WebpackIsomorphicToolsPlugin = require("webpack-isomorphic-tools/plugin");

module.exports = {
    assets: {
        // images: {
        //     extensions: [
        //         "jpeg",
        //         "jpg",
        //         "png",
        //         "gif",
        //     ],
        //     parser: WebpackIsomorphicToolsPlugin.url_loader_parser,
        // },
        // fonts: {
        //     extensions: [
        //         "woff",
        //         "woff2",
        //         "ttf",
        //         "eot",
        //     ],
        //     parser: WebpackIsomorphicToolsPlugin.url_loader_parser,
        // },
        // svg: {
        //     extension: "svg",
        //     parser: WebpackIsomorphicToolsPlugin.url_loader_parser,
        // },
        style_modules: {
            extensions: ['css'],
            filter(module, regex, options, log) {
                if (options.development) {
                    return WebpackIsomorphicToolsPlugin.style_loader_filter(module, regex, options, log);
                }
                return regex.test(module.name);
            },
            path(module, options, log) {
                if (options.development) {
                    return WebpackIsomorphicToolsPlugin.style_loader_path_extractor(module, options, log);
                }
                return module.name;
            },
            parser(module, options, log) {
                if (options.development) {
                    return WebpackIsomorphicToolsPlugin.css_modules_loader_parser(module, options, log);
                }
                return module.source;
            }
        }
    }
};
