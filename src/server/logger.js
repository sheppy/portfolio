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

import winston from "winston";
import { Papertrail } from "winston-papertrail";

const transports = [
    new winston.transports.Console({
        level: "debug",
        timestamp: () => new Date().toISOString(),
        colorize: true,
        handleExceptions: true
    })
];

// Enable papertrail logging
if (process.env.PAPERTRAIL_HOST && process.env.PAPERTRAIL_PORT) {
    const paperTrailTransport = new Papertrail({
        host: process.env.PAPERTRAIL_HOST,
        port: process.env.PAPERTRAIL_PORT,
        colorize: true,
        handleExceptions: true,
        program: "Portfolio"
    });

    paperTrailTransport.on("error", err => logger && logger.error(err));
    paperTrailTransport.on("connect", message => logger && logger.info(message));

    transports.push(paperTrailTransport);
}


const logger = new winston.Logger({
    transports,
    exitOnError: false
});

export default logger;

