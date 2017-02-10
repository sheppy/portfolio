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
import ReactDOM from "react-dom";
import styles from "./ProgressiveImage.css";


class ProgressiveImage extends Component {
    constructor(props) {
        super(props);
        this.state = { loaded: false };
    }

    handlePlaceholderLoaded() {
        let img = new Image();
        img.onload = this.handleImageLoaded.bind(this);
        img.src = this.props.src;
    }

    handleImageLoaded() {
        this.setState({ loaded: true });
    }

    componentDidMount() {
        const placeholder = ReactDOM.findDOMNode(this);
        if (!placeholder) { return; }

        if (placeholder.complete) {
            // Placeholder cached - load full image
            this.handlePlaceholderLoaded();
        } else {
            // Add the load event
            placeholder.onload = this.handlePlaceholderLoaded.bind(this);
        }
    }

    render() {
        const { src, placeholder, alt = "", width = 320, height = 256 } = this.props;
        return (
            <img
                className={this.state.loaded ? styles.image : styles.placeholder}
                src={this.state.loaded ? src : placeholder}
                data-src={src}
                width={width}
                height={height}
                alt={alt}
            />
        );
    }
}

ProgressiveImage.propTypes = {
    src: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string.isRequired
};

export default ProgressiveImage;
