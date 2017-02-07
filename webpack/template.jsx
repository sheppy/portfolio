"use strict";

import React from "react";
import { renderToString } from "react-dom/server";
import ReactHelmet from "react-helmet";
import renderFullPage from "../src/server/utils/renderFullPage";
import ServerError from "../src/shared/components/ServerError/ServerError";


const REGEX_REMOVE_REACT_DATA_ATTR = / data-react.*?="[^"]+"/g;


export default function(config) {
    const assets = { styles: {}, javascript: {}, assets: {} };

    // Build styles
    Object.keys(config.webpack.assetsByChunkName).forEach(chunk => {
        let filename = config.webpack.assetsByChunkName[chunk];

        if (typeof filename === "string") {
            if (filename.substr(-4) === ".css") {
                assets.styles[chunk] = filename;
            }
        } else {
            filename.forEach(filename => {
                if (filename.substr(-4) === ".css") {
                    assets.styles[chunk] = filename;
                }
            })
        }
    });

    const html = renderToString(<ServerError />).replace(REGEX_REMOVE_REACT_DATA_ATTR, "");
    const head = ReactHelmet.rewind();

    return renderFullPage(html, head, null, assets);
}
