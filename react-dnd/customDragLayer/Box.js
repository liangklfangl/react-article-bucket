import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shouldPureComponentUpdate from './shouldPureComponentUpdate';

const styles = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  cursor: 'move',
};

export default class Box extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    yellow: PropTypes.bool,
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    //实例化的时候: <Box title={title} />
    const { title, yellow } = this.props;
    const backgroundColor = yellow ? 'yellow' : 'white';
    //生成了两个Box实例
    return (
      <div style={{ ...styles, backgroundColor }}>
        {title}
      </div>
    );
  }
}
