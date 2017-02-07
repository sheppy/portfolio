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
import Helmet from "react-helmet";
import * as projectsActions from "../../store/projects/actions";
import * as projectsSelector from "../../store/projects/selectors";
import ListView from "../../components/ListView/ListView";
import ProjectTile from "../../components/ProjectTile/ProjectTile";


class ProjectListPage extends Component {
    componentDidMount() {
        if (!this.props.rowsById || !this.props.rowsIdArray) {
            this.props.dispatch(projectsActions.fetchProjects());
        }
    }

    render() {
        return (
            <div>
                <Helmet title="Recent Projects" />

                <h1>Projects</h1>

                <ListView rowsIdArray={this.props.rowsIdArray} rowsById={this.props.rowsById} renderRow={this.renderRow} />
            </div>
        );
    }

    renderRow(project) {
        return (
            <ProjectTile {...project} />
        );
    }
}

ProjectListPage.propTypes = {
    rowsIdArray: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    rowsById: React.PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return {
        rowsById: projectsSelector.getProjectsById(state),
        rowsIdArray: projectsSelector.getProjectsIdArray(state)
    };
};

const preloadDataActions = [{
    // dispatch actions here required to preload data for the component to render
    promise: ({ params, store: { dispatch }, location }) => dispatch(projectsActions.fetchProjects(params))
}];


export default asyncConnect(preloadDataActions, mapStateToProps)(ProjectListPage);
