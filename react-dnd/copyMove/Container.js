import React, { Component } from 'react';
import { DragDropContextProvider } from 'react-dnd';
//最外层的组件必须经过DragDropContextProvider处理
import HTML5Backend from 'react-dnd-html5-backend';
//经过HTML5Backend处理
import Dustbin from './Dustbin';
import Box from './Box';

//必须通过DragDropContextProvider对我们的容器进行包装，并传入我们的backend
export default class Container extends Component {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div>
          <div style={{ overflow: 'hidden', clear: 'both',border:"1px solid red" }}>
            <Dustbin allowedDropEffect="any" name="liangklfangl"/>
            <Dustbin allowedDropEffect="copy" name="liangklfang2"/>
            <Dustbin allowedDropEffect="move" name="liangklfang1" />
          </div>
          <div style={{ overflow: 'hidden', clear: 'both',border:"1px solid pink" }}>
            <Box name="Glass" />
            <Box name="Banana" />
            <Box name="Paper" />
          </div>
        </div>
      </DragDropContextProvider>
    );
  }
}
