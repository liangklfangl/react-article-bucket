import React, { Component } from 'react';
import PropTypes from "prop-types";
export default class StepZilla extends Component {
   constructor(props){
    super(props);
     this._next= this._next.bind(this);
     this.state={
         compState : 0
     }
   }
      _next() {
            // move to next step (if current step needs to be validated then do that first!)
            if (typeof this.refs.activeComponent.isValidated == 'undefined' ||
                this.refs.activeComponent.isValidated()) {
                    const next = this.state.compState+1;
                    this.setState({compState:next});

            }

      }
    render() {
        //问题：动态添加的组件如何通过ref调用组件本身的方法
         const compToRender = React.cloneElement(this.props.steps[this.state.compState].component, {
                ref: 'activeComponent'
            }

        );
        return (

          <div>
             <button onClick={this._next}>点击我切换到下一个组件</button>
             {compToRender}
          </div>

        )

    }


}
