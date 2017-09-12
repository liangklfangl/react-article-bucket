/* global Prism */

import React, { PureComponent } from "react";

import { PropTypes } from "prop-types";

export default class PrismCode extends PureComponent {
  static propTypes = {
    async: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.any,
    component: PropTypes.node,
  };

  static defaultProps = {
    component: `code`,
  }

  componentDidMount() {
    this._hightlight();
  }

  componentDidUpdate() {
    this._hightlight();
  }

  _hightlight() {
    Prism.highlightElement(this._domNode, this.props.async);
  }

  _handleRefMount = (domNode) => {
    this._domNode = domNode
  }

  render() {
    const { className, component: Wrapper, children } = this.props;

    return (
      <Wrapper
        ref={this._handleRefMount}
        className={className}
      >
        {children}
      </Wrapper>
    );
  }
}
