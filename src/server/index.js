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
import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { match } from "react-router";
import { createStore, applyMiddleware } from "redux";
import { ReduxAsyncConnect, loadOnServer } from "redux-connect";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import serialize from "serialize-javascript";
import runMiddleware from "run-middleware";
import NestedStatus from "react-nested-status";
import ReactHelmet from "react-helmet";

import api from "./api";
import routes from "../shared/routes";
import rootReducer from "../shared/store/reducers";


// Patch fetch with local data!
async function loadData(url, options) {
    return new Promise((resolve, reject) => {
        app.runMiddleware(url, {}, function (statusCode, data) {
            if (statusCode === 200) {
                return resolve({
                    ok: true,
                    json: () => JSON.parse(data)
                });
            }

            reject({
                ok: false,
                json: () => JSON.parse(data)
            });
        });
    });
}
global.fetch = loadData;


function renderFullPage(componentHTML, initialState, assets) {
    const styles = Object.keys(assets.styles).map(style => `<link href="${assets.styles[style]}" rel="stylesheet" />`);
    const head = ReactHelmet.rewind();
    const regexRemoveMetaDataAttr = / data-react-helmet="true"/g;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${head.title.toString().replace(regexRemoveMetaDataAttr, "")}
    ${head.meta.toString().replace(regexRemoveMetaDataAttr, "")}
    
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

runMiddleware(app);

app.use(express.static(path.resolve(__dirname, "..", "..", "public")));

app.use("/api", api);

app.use((req, res, next) => {
    const middleware = applyMiddleware(thunk);
    const store = createStore(rootReducer, middleware);

    match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
        if (process.env.NODE_ENV === "development") {
            webpackIsomorphicTools.refresh();
        }

        if (err) {
            return next(err);
        }

        // In case of redirect propagate the redirect to the browser
        if (redirectLocation) {
            return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        }

        if (!renderProps) {
            // TODO: When does this happen?
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
                const status = NestedStatus.rewind();

                res.status(status).end(renderFullPage(componentHTML, initialState, webpackIsomorphicTools.assets()));
            })
            .catch(next);
    });
});


app.use((err, req, res, next) => {
    // TODO: Nice static error page
    console.error(err);
    res.status(500).end("500: Internal server error");
});

export default app;
