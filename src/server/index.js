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
import runMiddleware from "run-middleware";
import expressStaticGzip from "express-static-gzip";
import expressWinston from "express-winston";

import logger from "./utils/logger";
import apiRoute from "./routes/api";
import reactRoute from "./routes/react";


// TODO: Move to utils
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


const app = express();

// Middleware to access /api routes internally
runMiddleware(app);

// Static assets
app.use("/", expressStaticGzip(path.resolve(__dirname, "..", "..", "build")));
app.use("/", expressStaticGzip(path.resolve(__dirname, "..", "..", "public")));

// Logging
app.use(expressWinston.logger({
    winstonInstance: logger,
    expressFormat: true,
    colorize: true
}));

// Routes
app.use("/api", apiRoute);
app.use(reactRoute);

// TODO: Static 404 page

// Static error page
app.use((err, req, res, next) => {
    // TODO: Nice static error page
    logger.error(err);
    res.status(500).end("500: Internal server error");
});

export default app;
