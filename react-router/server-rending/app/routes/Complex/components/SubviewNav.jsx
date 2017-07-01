import React, { Component } from 'react';
import { Link } from 'react-router/es';
import styles from './SubviewNav.scss';

class SubviewNav extends Component {
	render() {
		return (
			<div className={ styles.otherwise }>
				<Link to="/complex/page1" activeClassName={ styles.active }>
                                    Page1
				</Link>
				<Link to="/complex/page2" activeClassName={ styles.active }>
                                    Page2
				</Link>
			</div>
		)
	}
}

module.exports = SubviewNav;
				

