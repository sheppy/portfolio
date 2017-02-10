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
import { renderToStaticMarkup } from "react-dom/server";
import Html from "../containers/Html/Html";
import AmpHtml from "../containers/AmpHtml/AmpHtml";


export function renderHtmlPage(body, head, assets, state, pathName) {
    const props = { body, head, assets, state, pathName };
    const doctype = "<!DOCTYPE html>";
    const html = renderToStaticMarkup(<Html {...props} />)
        .replace(/ data-react-helmet="true"/g, "");

    return `${doctype}\n${html}`;
}


export function renderAmpPage(body, head, assets, pathName) {
    const props = { body, head, assets, pathName };
    const doctype = "<!DOCTYPE html>";
    const html = renderToStaticMarkup(<AmpHtml {...props} />)
        .replace(/ amp="true"/g, " ⚡")
        .replace(/ amp-custom="true"/g, " amp-custom")
        .replace(/ amp-boilerplate="true"/g, " amp-boilerplate")
        .replace(/ is="true"/g, "")
        .replace(/ async="[^"]*"/g, " async")
        .replace(/ data-react[^=]+="[^"]+"/g, "")
        .replace(/ data-reactroot=""/g, "")
        .replace(/<!-- react-empty: \d+ -->/g, "")
        .replace(/<img (.*?)src="([^"]+)" data-src="([^"]+)"([^>]*)>/g, "<amp-img layout=\"responsive\" $1src=\"$3\"$4></amp-img>")
        .replace(/<img ([^>]+)>/g, "<amp-img layout=\"responsive\" $1></amp-img>");

    return `${doctype}\n${html}`;
}
