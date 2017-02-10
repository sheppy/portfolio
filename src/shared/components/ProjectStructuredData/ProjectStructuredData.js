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
import Helmet from "react-helmet";

const coreLdJson = {
    "@context": "http://schema.org",
    "@type": "WebSite",
    "name": "Chris Sheppard's Portfolio",
    "url": "http://portfolio.chrissheppard.co.uk",
    "author": {
        "@type": "Person",
        "name": "Chris Sheppard",
        "jobTitle": "JavaScript Developer",
        "url": "http://www.chrissheppard.co.uk"
    }
};


const ProjectStructuredData = ({ projects }) => {
    const workExample = Object.keys(projects).map(id => {
        let project = projects[id];
        let example = { "@type": "WebSite", "name": project.title };
        if (project.url) { example.url = project.url; }
        if (project.author) {
            example.author = {
                "@type": "Organization",
                "name": project.author.name,
                "url": project.author.url
            };
        }
        return example;
    });

    return (<Helmet script={[{ type: "application/ld+json", innerHTML: JSON.stringify(Object.assign({}, coreLdJson, {workExample})) }]} />);
};

export default ProjectStructuredData;
