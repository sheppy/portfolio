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

import Immutable from "seamless-immutable";
import * as T from "./actionTypes";


const initialState = Immutable({
    projectsById: {},
    projectIds: []
});

const handlers = {
    [T.PROJECTS_FETCHED]: (state, action) =>
        state.merge({ projectsById: action.projectsById }, { deep: true }),
    [T.PROJECT_FETCHED]: (state, action) =>
        state.merge({ projectsById: { [action.project.id]: action.project }}, { deep: true })
};

export default (state = initialState, action = {}) =>
    handlers[action.type] ? handlers[action.type](state, action) : state;
