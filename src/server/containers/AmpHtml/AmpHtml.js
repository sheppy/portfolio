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
import config from "../../../shared/config.json";

const IS_PROD = (process.env.NODE_ENV === "production");

const AmpHtml = ({ body, head, assets, pathName }) => {
    const inlineStyles = Object.keys(assets.assets).map(asset => assets.assets[asset]._style || "").filter(n => !!n).join("\n");

    const boilerplateStyles = "body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}";
    const fallbackBoilerplateStyles = "body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}";
    const analytics = {
        "vars": {
            "account": config.gaAccount
        },
        "triggers": {
            "trackPageview": {
                "on": "visible",
                "request": "pageview"
            }
        }
    };

    return (
        <html is amp lang="en">
        <head>
            <meta charSet="utf-8" />
            {IS_PROD &&
                <script is async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>
            }
            <script async src="https://cdn.ampproject.org/v0.js"></script>
            {head.title.toComponent()}
            <link rel="canonical" href={pathName} />
            <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
            {inlineStyles &&
                <style is amp-custom dangerouslySetInnerHTML={{ __html: inlineStyles }} />
            }
            {head.script.toComponent()}
            <style is amp-boilerplate>{boilerplateStyles}</style>
            <noscript><style is amp-boilerplate>{fallbackBoilerplateStyles}</style></noscript>
        </head>
        <body>
            <div dangerouslySetInnerHTML={{ __html: body }}></div>

            {IS_PROD &&
                <amp-analytics type="googleanalytics">
                    <script type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(analytics) }}></script>
                </amp-analytics>
            }
        </body>
        </html>
    )
};

export default AmpHtml;
