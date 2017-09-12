import PrismCode from "react-prism";
import React from "react";
import ReactDOM from "react-dom";
export default class Test extends React.Component{
  render () {
    return (
      <div className="container">
         <PrismCode component="pre" className="language-javascript">
           {
            `   import { Breadcrumb } from 'antd';
                ReactDOM.render(
                <Breadcrumb>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item><a href="">Application Center</a></Breadcrumb.Item>
                    <Breadcrumb.Item><a href="
                ">Application List</a></Breadcrumb.Item>
                    <Breadcrumb.Item>An Application</Breadcrumb.Item>
                </Breadcrumb>
                , mountNode);
        `}
         </PrismCode>
      </div>
    );
  }

}

ReactDOM.render(<Test/>,document.getElementById('react-content'));
