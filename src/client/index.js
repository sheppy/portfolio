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
import { render } from "react-dom";
import { Router, browserHistory } from "react-router";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import Immutable from "seamless-immutable";
import ReactGA from "react-ga";
import routes from "../shared/routes";
import rootReducer from "../shared/store/reducers";
import config from "../shared/config.json";


let bootstrap = document.getElementById("bootstrap").textContent;
if (bootstrap) {
    bootstrap = JSON.parse(bootstrap);
}
let initialState = Immutable(bootstrap);

const middleware = applyMiddleware(thunk);
const store = createStore(rootReducer, initialState, middleware);


if (process.env.NODE_ENV === "production") {
    ReactGA.initialize(config.gaAccount);
}

const logPageView = () => {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
};

render(
    <Provider store={store}>
        <Router children={routes} history={browserHistory} onUpdate={logPageView}/>
    </Provider>,
    document.getElementById("app")
);
