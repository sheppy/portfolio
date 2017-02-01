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

import find from "lodash/find";

const PROJECTS_ENDPOINT = "/";


class ProjectsService {
    async getDefaultProjects() {
        const url = `${PROJECTS_ENDPOINT}default.json`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`ProjectsService getDefaultProjects failed, HTTP status ${response.status}`);
        }

        const data = await response.json();
        const projects = data.projects;

        if (!projects) {
            throw new Error(`ProjectsService getDefaultProjects failed, projects not returned`);
        }

        return projects;
    }

    async getProjectDetails(id) {
        const url = `${PROJECTS_ENDPOINT}default.json`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`ProjectsService getProjectDetails(${id}) failed, HTTP status ${response.status}`);
        }

        const data = await response.json();
        const projects = data.projects;

        if (!projects) {
            throw new Error(`ProjectsService getProjectDetails(${id}) failed, projects not returned`);
        }

        const project = find(projects, { id: parseInt(id, 10) });

        if (!project) {
            throw new Error(`ProjectsService getProjectDetails(${id}) failed, project not found`);
        }

        return project;
    }
}

export default new ProjectsService();
