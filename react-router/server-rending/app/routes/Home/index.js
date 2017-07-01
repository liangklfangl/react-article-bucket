module.exports = {
	path: 'home',
	getComponent(nextState, cb) {
		/*
		new webpack.DefinePlugin({
            // http://stackoverflow.com/a/35372706/2177568
            // for server side code, just require, don't chunk
            // use `if (ONSERVER) { ...` for server specific code
            // 服务器端的代码直接require而不是通过if判断
            ONSERVER: false
        })
        因为，我们直接通过DefinePlugin定义了这个onserver变量为false，所以我们可以直接判断这个
		 */
        if (ONSERVER) {
            cb(null, require('./components/Home.jsx'));
        } else {
            System.import('./components/Home.jsx')
                .then((Home) => cb(null, Home));
         //服务器端我们直接require，而客户端我们采用lazyload，采用System.import
        }
	}
}
