import React, { Component } from 'react';

import SubviewNav from './SubviewNav.jsx';

import styles from './Complex.scss';


class Complex extends Component {
	render() {
		return (
			<div className={ styles.main }>
                                <h2> This page has nested routes! </h2>
                                <SubviewNav/>
				{ this.props.children }
		    	{/*this.props.children表示的是通过配置path为'complex'的组件开始的*/}
			</div>
		)
	}
}

module.exports = Complex;
