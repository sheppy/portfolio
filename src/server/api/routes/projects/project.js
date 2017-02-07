/**
 * @author Chris Sheppard <chris@chrissheppard.co.uk>
 *
 * @license
 * GPLv3Copyright (C) 2016 Chris Sheppard
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

import mongoose from "mongoose";
import ProjectModel from "../../models/Project";


export const projectIdParam = (req, res, next, id) => {
    const json404 = {
        status: 404,
        error: "Invalid project ID"
    };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(json404);
    }

    ProjectModel
        .findById(id)
        .then(project => {
            if (!project) {
                return res.status(404).send(json404);
            }
            req.project = project;
            return next();
        })
        .catch(next);
};

export const getProjects = (req, res, next) => {
    let { tags, sort = "-createdAt" } = req.query;
    const query = {};

    if (tags) {
        query.tags = { $all: tags.split(",") };
    }

    if (sort) {
        sort = sort.replace(",", " ");
    }

    ProjectModel
        .find(query)
        .select("id title image imageTiny tags")
        .sort(sort)
        .then(projects => res.json({ projects }))
        .catch(next);
};

export const getProject = (req, res) => {
    res.json({ project: req.project });
};

export const getProjectTags = (req, res, next) => {
    ProjectModel
        .distinct("tags")
        .then(tags => res.json({ tags }))
        .catch(next);
};
