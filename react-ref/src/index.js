import Step1 from './step1';

import Step2 from './step2';

import StepZilla from './stepzilla.js'

import Step3 from './step3';
import React from "react";
import ReactDOM from "react-dom";

const steps =

    [

      {name: 'Welcome', component: <Step1 />},

      {name: 'Personals', component: <Step2 />},

      {name: 'Emergency', component: <Step3 />}

    ]

export default class Main extends React.Component{
    render() {
        return (
            <div className='step-progress'>
                <StepZilla steps={steps}/>
             </div>

        )
    }

}

ReactDOM.render(<Main/>,document.getElementById('react-content'));
