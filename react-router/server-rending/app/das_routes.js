module.exports = {
	path: '/',
	component: require('./components/App.jsx'),
	//直接接入该页面的时候我们转到'/home'这个URL
	indexRoute: {
		onEnter: (nextState, replace) => {
			replace('/home')

		}
	},
	//如果是childRoutes那么表示我们进入了下一级URL，path是可以concat的！
	//所以，当我们直接进入这个页面的时候我们只会加载/home页面对应的js文件资源，而其他的complex/about都不会加载
	childRoutes: [ {
		// path:"/child",
		// 这里没有配置path，表示这一个级别对URL没有变化，直接看里面层级的childRoutes
		// 这也是为什么外面的层级可以直接转向到home的原因
		childRoutes: [
			require('./routes/Home'),
			//这里三个都是App.jsx的this.props.children，默认是实例化这个组件Home
            require('./routes/Complex'),
			require('./routes/About')
		],
	} ]
};
