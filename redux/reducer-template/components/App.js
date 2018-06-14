import React from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'
import "./App.less";
class App extends React.Component{
  render(){
    return <div>
        <p onClick={this.props.actions.setFuck}>我监听auth</p>
        <p onClick={this.props.actions.setEdit}>我监听edit</p>
    </div>
  }
}

/**
 *
 * @param {*} state
 * 给到组件
 */
const mapStateToProps = state => ({
  value:state.auth.name
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions, dispatch)
})

export default connect(mapStateToProps,mapDispatchToProps)(App);
