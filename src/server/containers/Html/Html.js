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

import React from "react";
import serialize from "serialize-javascript";

const Html = ({ body, head, assets, state, pathName }) => {
    const {vendor, ...otherScripts} = assets.javascript;
    const scripts = { vendor, ...otherScripts };
    if (!scripts.vendor) {
        delete scripts.vendor;
    }

    const inlineStyles = Object.keys(assets.assets).map(asset => assets.assets[asset]._style || "").filter(n => !!n).join("\n");

    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
            <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
            {head.title.toComponent()}
            {head.meta.toComponent()}
            {head.link.toComponent()}
            {head.script.toComponent()}
            {pathName &&
                <link rel="amphtml" href={`${pathName}?amp=1`} />
            }

            {inlineStyles &&
                <style type="text/css" dangerouslySetInnerHTML={{ __html: inlineStyles }} />
            }

            {assets.styles && Object.keys(assets.styles).map((style, i) =>
                <link href={assets.styles[style]} key={i} rel="stylesheet" />
            )}
        </head>
        <body>
            <div id="app" dangerouslySetInnerHTML={{ __html: body }} />

            {state &&
                <script type="application/json" id="bootstrap" dangerouslySetInnerHTML={{ __html: serialize(state) }} />
            }

            {scripts && Object.keys(scripts).map((script, i) =>
                <script src={scripts[script]} key={i} />
            )}
        </body>
        </html>
    )
};

export default Html;
