import React, { Component } from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Dustbin from './Dustbin';
import Box from './Box';
//(1)DragDropContextProvider包裹我们的根组件
export default class Container extends Component {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div>
          <div style={{ overflow: 'hidden', clear: 'both' }}>
            <Dustbin />
          </div>
          <div style={{ overflow: 'hidden', clear: 'both' }}>
            <Box name="Glass" sex="male"/>
            <Box name="Banana" sex="female" />
            <Box name="Paper" sex="neutral"/>
          </div>
        </div>
      </DragDropContextProvider>
    );
  }
}
