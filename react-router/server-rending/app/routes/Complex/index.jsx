module.exports = {
	path: 'complex',
	//complex这个URL
	getChildRoutes(partialNextState, cb) {
        if (ONSERVER) {
			cb(null, [
				require('./routes/Page1'),
				require('./routes/Page2')
			])
        } else {
            require.ensure([], (require) => {
                cb(null, [
                    require('./routes/Page1'),
                    require('./routes/Page2')
                ])
            })
        }
	},
    //IndexRoute表示默认加载的子组件，
	getIndexRoute(partialNextState, cb) {
        if (ONSERVER) {
			const { path, getComponent } = require('./routes/Page1');
			cb(null, { getComponent });
        } else {
            require.ensure([], (require) => {
                // separate out the path part, otherwise warning raised
                // 获取下一个模块的path和getComponent，因为他是采用module.export直接导出的
                // 我们直接将getComponent传递给callback函数
                const { path, getComponent } = require('./routes/Page1');
                cb(null, { getComponent });
            })
        }
	},
    //getComponent只是表示获取到该实例化那么Component而已，我们这里是'complex'路径此时表示实例化
    //我们的Complex，然后getIndexRoute表示实例化那个子组件
	getComponent(nextState, cb) {
        if (ONSERVER) {
            cb(null, require('./components/Complex.jsx'));
        } else {
            require.ensure([], (require) => {
                cb(null, require('./components/Complex.jsx'))
            })
        }
	}
}
