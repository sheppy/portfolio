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
import helmet from "helmet";

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

const DIR_BUILD = path.resolve(__dirname, "..", "..", "build");
const DIR_PUBLIC = path.resolve(__dirname, "..", "..", "public");

const app = express();

// Security
if (process.env.NODE_ENV === "production") {
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "data:"]
        }
    }));
}
app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard({ action: "sameorigin" }));
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.referrerPolicy({ policy: "same-origin" }));
app.use(helmet.xssFilter());


// Middleware to access /api routes internally
runMiddleware(app);

// Static assets
app.use("/", expressStaticGzip(DIR_BUILD));
app.use("/", expressStaticGzip(DIR_PUBLIC));

// Logging
app.use(expressWinston.logger({
    winstonInstance: logger,
    expressFormat: true,
    colorize: true
}));

// Routes
app.use("/api", apiRoute);
app.use(reactRoute);

// Static error page
app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).sendFile(path.join(DIR_BUILD, "500.html"));
});

// Fatal error page
app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).end("500: Internal server error");
});

export default app;
