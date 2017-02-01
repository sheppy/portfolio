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

import path from "path";
import fs from "fs";
import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { match } from "react-router";
import { createStore, applyMiddleware } from "redux";
import { ReduxAsyncConnect, loadOnServer } from "redux-connect";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import serialize from "serialize-javascript";

import routes from "../shared/routes";
import rootReducer from "../shared/store/reducers";


// Patch fetch with local data!
let data = fs.readFileSync(path.join(__dirname, "..", "..", "public", "default.json"), "utf-8");
async function loadData() {
    return {
        ok: true,
        json: function() { return JSON.parse(data); }
    };
}
global.fetch = loadData;


function renderFullPage(componentHTML, initialState, assets) {
    let styles = Object.keys(assets.styles).map(style => `<link href="${assets.styles[style]}" rel="stylesheet" />`);

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Portfolio</title>
    
    ${styles.join("\n")}
</head>
<body>
    <div id="app">${componentHTML}</div>
    
    <script type="application/javascript">
      window.__INITIAL_STATE__ = ${serialize(initialState)};
    </script>
    
    <script src="${assets.javascript.vendor}"></script>
    <script src="${assets.javascript.app}"></script>
</body>
</html>`;
}


const app = express();

app.use(express.static(path.resolve(__dirname, "..", "..", "public")));

app.use((req, res) => {
    const middleware = applyMiddleware(thunk);
    const store = createStore(rootReducer, middleware);

    match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
        if (process.env.NODE_ENV === "development") {
            webpackIsomorphicTools.refresh();
        }

        if (err) {
            console.error(err);
            return res.status(500).end("Internal server error");
        }

        // In case of redirect propagate the redirect to the browser
        if (redirectLocation) {
            return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        }

        if (!renderProps) {
            return res.status(404).end("Not found.");
        }

        loadOnServer({ ...renderProps, store })
            .then(() => {
                const initialComponent = (
                    <Provider store={store}>
                        <ReduxAsyncConnect {...renderProps} />
                    </Provider>
                );

                const initialState = store.getState();
                const componentHTML = renderToString(initialComponent);

                res.end(renderFullPage(componentHTML, initialState, webpackIsomorphicTools.assets()));
            })
            .catch(err => {
                console.error(err);
                res.status(500).end("Internal server error");
            });
    });
});


export default app;
