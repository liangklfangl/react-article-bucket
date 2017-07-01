import React from 'react';
import styles from './App.scss';
import { Link } from 'react-router/es';

module.exports = React.createClass({
	render() {
		return (
			<div className={ styles.global }>
				<header>
                                        <h1> A demo site! </h1>
				</header>
				<nav className={ [styles.nav, styles.top_nav].join(' ') }>
					<Link to="/home" activeClassName={ styles.active }>
						home
					</Link>
					<Link to="/complex" activeClassName={ styles.active }>
						complex page
					</Link>
					<Link to="/about" activeClassName={ styles.active }>
						learn more
					</Link>
				</nav>
				<main className={ styles.main }>
					{ this.props.children }
				</main>
			</div>
		)
	},
});
