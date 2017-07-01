import { render } from 'react-dom';
import React from 'react';
import { Router, Link, useRouterHistory } from 'react-router/es';
import { createHistory } from 'history';
import routes from './das_routes.js';
//该文件是我们的Route对象的配置
const browserHistory = useRouterHistory(createHistory)({ basename: '/' });

render(
	<Router history={ browserHistory } routes={ routes }/>,
	 document.getElementById('root')
);

