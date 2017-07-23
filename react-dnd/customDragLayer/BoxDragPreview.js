import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shouldPureComponentUpdate from './shouldPureComponentUpdate';
import Box from './Box';

const styles = {
  display: 'inline-block',
  transform: 'rotate(-7deg)',
  WebkitTransform: 'rotate(-7deg)',
};

export default class BoxDragPreview extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
    this.tick = this.tick.bind(this);
    //tickTock默认为false
    this.state = {
      tickTock: false,
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  tick() {
    this.setState({
      tickTock: !this.state.tickTock,
    });
  }

 /**
  * 组件实例化的时候为:<BoxDragPreview title={item.title} />
  * @return {[type]} [description]
  */
  render() {
    const { title } = this.props;
    const { tickTock } = this.state;
    return (
      <div style={styles}>
        {/*Box的yellow是一个随机的函数产生的，即setInterval动态变化的过程*/}
        <Box title={title} yellow={tickTock} />
      </div>
    );
  }
}
