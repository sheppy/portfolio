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

const REGEX_REMOVE_META_DATA_ATTR = / data-react-helmet="true"/g;


export default function renderFullPage(componentHtml, head, state = {}, assets = {}) {
    const title = head.title.toString().replace(REGEX_REMOVE_META_DATA_ATTR, "");
    const meta = head.meta.toString().replace(REGEX_REMOVE_META_DATA_ATTR, "");

    const styles = Object.keys(assets.styles).map(style => `<link href="${assets.styles[style]}" rel="stylesheet">`);
    const inlineStyles = Object.keys(assets.assets).map(asset => assets.assets[asset]._style || "").filter(n => !!n);

    if (inlineStyles.length) {
        styles.unshift(`<style type="text/css">${inlineStyles.join("\n")}</style>`);
    }

    const scripts = Object.keys(assets.javascript).filter(n => n !== "vendor").map(script => `<script src="${assets.javascript[script]}"></script>`);

    if (assets.javascript.vendor) {
        scripts.unshift(`<script src="${assets.javascript.vendor}"></script>`)
    }

    const bootstrap = state ? `<script type="application/json" id="bootstrap">${serialize(state)}</script>` : "";

    const html = `
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${title}
    ${meta}
    ${styles.join("\n")}
</head>
<body>
    <div id="app">${componentHtml}</div>
    
    ${bootstrap}
    
    ${scripts.join("\n")}
</body>
</html>`;

    return `<!DOCTYPE html>${html}`;
}
