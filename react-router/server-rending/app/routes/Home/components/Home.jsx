import React, { Component } from 'react';
import styles from './Home.scss';

class Home extends Component {
	render() {
		return (
			<div className={ styles.main }>
                            <h2> Welcome to the home page. </h2>
			</div>
		)
	}
}

module.exports = Home;
