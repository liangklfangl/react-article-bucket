module.exports = {
	path: 'about',
	getComponent(nextState, cb) {
        if (ONSERVER) {
            // Don't code split w/ System.import for server side render
            cb(null, require('./components/About.jsx'));
        } else {
            System.import('./components/About.jsx')
                .then((About) => cb(null, About));
        }
	}
}
