 import React from "react";
 import ReactDOM from "react-dom";
 import ChildSchool from "./ChildSchool";
 import ChildHome from "./ChildHome";
 const Immutable = require('immutable')
 class Parent extends React.Component{
  state = {
    information:Immutable.fromJS({
       a:1,
       b:2,
       c:3,
       home:{
         location:{
           name:'Hunan huaihua',
           street:405
         }
       },
      school:{
       location:"DaLian",
       name :"DLUT",
       ratio:{
         Hunan:698,
         ZheJiang : 900
       }
      }
    })
  }
  /**
   * 修改school部分,此时我们的home部分不会改变，采用共享引用的方式，所以ChildHome不会重新渲染
   * 注意：下面必须是一个updateIn而不是update方法
   * @return {[type]} [description]
   */
  updateSchool=()=>{
     this.setState({
       information:this.state.information.updateIn(["school","ratio","ZheJiang"],(value)=>value+1)
     });
  }
  /**
   * 修改home部分，此时我们的school部分不会改变，所以school部分采用了引用共享，所以childSchool不会重新
   * 渲染
   * @return {[type]} [description]
   */
  updateHome=()=>{
   this.setState({
     information:this.state.information.updateIn(["home","location","street"],(value)=>value+1)
   })
  }

   render(){
     return (
        <div>
          <ChildSchool information={this.state.information}></ChildSchool>
          <ChildHome information={this.state.information}></ChildHome>
          <button onClick={this.updateSchool}>点击我修改ChildSchool</button>
          <button onClick={this.updateHome}>点击我修改ChildHome</button>
        </div>
      )
   }
 }

ReactDOM.render(<Parent/>,document.getElementById('react-content'))
