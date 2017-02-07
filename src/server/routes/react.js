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


import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { match } from "react-router";
import { createStore, applyMiddleware } from "redux";
import { ReduxAsyncConnect, loadOnServer } from "redux-connect";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import NestedStatus from "react-nested-status";
import ReactHelmet from "react-helmet";

import routes from "../../shared/routes";
import rootReducer from "../../shared/store/reducers";
import renderFullPage from "../utils/renderFullPage";

const reactRoute = express.Router();


const serverSideRender = async (url) => {
    const middleware = applyMiddleware(thunk);
    const store = createStore(rootReducer, middleware);

    return new Promise((resolve, reject) => {
        match({ routes, location: url }, (err, redirectLocation, renderProps) => {
            if (err) {
                return reject(err);
            }

            if (!renderProps) {
                // TODO: When does this happen?
                return reject({ status: 404 })
            }

            // TODO:
            //     // In case of redirect propagate the redirect to the browser
            //     if (redirectLocation) {
            //         return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
            //     }

            if (process.env.NODE_ENV === "development") {
                webpackIsomorphicTools.refresh();
            }

            loadOnServer({ ...renderProps, store })
                .then(() => {
                    const initialComponent = (
                        <Provider store={store}>
                            <ReduxAsyncConnect {...renderProps} />
                        </Provider>
                    );

                    const state = store.getState();
                    const html = renderToString(initialComponent);
                    const status = NestedStatus.rewind();
                    const head = ReactHelmet.rewind();
                    const assets = webpackIsomorphicTools.assets();

                    resolve({ status, html, head, state, assets });
                })
                .catch(reject);
        });
    });
};


reactRoute.use((req, res, next) => {
    serverSideRender(req.url)
        .then(({ status, html, head, state, assets }) => {
            res.status(status).send(renderFullPage(html, head, state, assets))
        })
        .catch(err => {
            if (err.status === 404) {
                return next();
            }

            next(err);
        });
});


export default reactRoute;
