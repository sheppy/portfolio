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

import React, { Component } from "react";
import { asyncConnect } from "redux-connect";
import * as projectsActions from "../../store/projects/actions";
import * as projectsSelector from "../../store/projects/selectors";


class ProjectPage extends Component {
    componentDidMount() {
        this.props.dispatch(projectsActions.fetchProjectDetails(this.props.params.projectId));
    }

    render() {
        return (
            <div>
                <h1>{this.props.project.title}</h1>

                <p>{this.props.project.description}</p>
            </div>
        );
    }
}

ProjectPage.propTypes = {
    project: React.PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        project: projectsSelector.getProjectDetails(state, ownProps.params.projectId)
    };
};

const preloadDataActions = [{
    // dispatch actions here required to preload data for the component to render
    promise: ({ params, store: { dispatch }, location }) => dispatch(projectsActions.fetchProjectDetails(params.projectId))
}];


export default asyncConnect(preloadDataActions, mapStateToProps)(ProjectPage);
