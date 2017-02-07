"use strict";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactHelmet from "react-helmet";
import renderFullPage from "../src/server/utils/renderFullPage";
import ServerError from "../src/server/components/ServerError/ServerError";


export default function(config) {
    const assets = { styles: {}, javascript: {}, assets: {} };

    // Build styles
    Object.keys(config.webpack.assetsByChunkName).forEach(chunk => {
        let filename = config.webpack.assetsByChunkName[chunk];

        if (typeof filename === "string") {
            if (filename.substr(-4) === ".css") {
                assets.styles[chunk] = `${config.webpack.publicPath}${filename}`;
            }
        } else {
            filename.forEach(filename => {
                if (filename.substr(-4) === ".css") {
                    assets.styles[chunk] = `${config.webpack.publicPath}${filename}`;
                }
            })
        }
    });

    const body = renderToStaticMarkup(<ServerError />);
    const head = ReactHelmet.rewind();

    return renderFullPage(body, head, assets);
}
