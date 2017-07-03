'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = updateRules;

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * [updateRules Update rules]
 * @param  {[type]} wpOpt [description]
 * @param  {[type]} rule  [description]
 * @return {[type]}       [description]
 */
var production = [{
  test: /\.module\.css$/i,
  use: _extractTextWebpackPlugin2.default.extract([{
    loader: require.resolve('css-loader'),
    options: {
      modules: true,
      //enable css module,You can switch it off with :global(...) or :global for selectors and/or rules.
      localIdentName: '[path][name]__[local]--[hash:base64:5]',
      //path will be replaced by file path(foler path relative to project root)
      //name will be replaced by file name
      //local will be replaced by local class name
      sourceMap: true,
      //the extract-text-webpack-plugin can handle them.
      importLoaders: 1,
      // That many loaders after the css-loader are used to import resources.
      minimize: true,
      //You can also disable or enforce minification with the minimize query parameter.
      camelCase: false
    }
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      //browsers (array): list of browsers query (like last 2 version), which are supported in 
      //your project. We recommend to use browserslist config or browserslist key in package.json, 
      //rather than this option to share browsers with other tools. See Browserslist docs for available queries and default value.
      cascade: true,
      //then beatified as follows with right indent
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg); 
      add: false,
      //Autoprefixer will only clean outdated prefixes, but will not add any new prefixes.  
      remove: false,
      //By default, Autoprefixer also removes outdated prefixes.
      //You can disable this behavior with the remove: false option. 
      //If you have no legacy code, this option will make Autoprefixer about 10% faster.  
      support: true,
      //should Autoprefixer add prefixes for @supports parameters.  
      flexbox: true,
      //should Autoprefixer add prefixes for flexbox properties. With "no-2009" 
      //value Autoprefixer will add prefixes only for final and IE versions of specification. Default is true.
      grid: true
    }
  }])
}, {
  test: /\.module\.less$/i,
  use: _extractTextWebpackPlugin2.default.extract([{
    loader: require.resolve('css-loader'),
    options: {
      modules: true,
      //enable css module,You can switch it off with :global(...) or :global for selectors and/or rules.
      localIdentName: '[path][name]__[local]--[hash:base64:5]',
      //path will be replaced by file path(foler path relative to project root)
      //name will be replaced by file name
      //local will be replaced by local class name
      sourceMap: true,
      //the extract-text-webpack-plugin can handle them.
      importLoaders: 1,
      // That many loaders after the css-loader are used to import resources.
      minimize: true,
      //You can also disable or enforce minification with the minimize query parameter.
      camelCase: false
    }
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      //browsers (array): list of browsers query (like last 2 version), which are supported in 
      //your project. We recommend to use browserslist config or browserslist key in package.json, 
      //rather than this option to share browsers with other tools. See Browserslist docs for available queries and default value.
      cascade: true,
      //then beatified as follows with right indent
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg); 
      add: false,
      //Autoprefixer will only clean outdated prefixes, but will not add any new prefixes.  
      remove: false,
      //By default, Autoprefixer also removes outdated prefixes.
      //You can disable this behavior with the remove: false option. 
      //If you have no legacy code, this option will make Autoprefixer about 10% faster.  
      support: true,
      //should Autoprefixer add prefixes for @supports parameters.  
      flexbox: true,
      //should Autoprefixer add prefixes for flexbox properties. With "no-2009" 
      //value Autoprefixer will add prefixes only for final and IE versions of specification. Default is true.
      grid: true
    }
  }, {
    loader: require.resolve('less-loader'),
    options: {
      sourceMap: true,
      lessPlugins: []
      //sourcemaps are only available in conjunction with the extract-text-webpack-plugin
      // modifyVars: JSON.stringify(theme)
      //using theme config in package.json to modify default less variables
    }
  }])
}, {
  test: /\.module\.scss$/i,
  use: _extractTextWebpackPlugin2.default.extract([{
    loader: require.resolve('css-loader'),
    options: {
      modules: true,
      //enable css module,You can switch it off with :global(...) or :global for selectors and/or rules.
      localIdentName: '[path][name]__[local]--[hash:base64:5]',
      //path will be replaced by file path(foler path relative to project root)
      //name will be replaced by file name
      //local will be replaced by local class name
      sourceMap: true,
      //the extract-text-webpack-plugin can handle them.
      importLoaders: 1,
      // That many loaders after the css-loader are used to import resources.
      minimize: true,
      //You can also disable or enforce minification with the minimize query parameter.
      camelCase: false
    }
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      //browsers (array): list of browsers query (like last 2 version), which are supported in 
      //your project. We recommend to use browserslist config or browserslist key in package.json, 
      //rather than this option to share browsers with other tools. See Browserslist docs for available queries and default value.
      cascade: true,
      //then beatified as follows with right indent
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg); 
      add: false,
      //Autoprefixer will only clean outdated prefixes, but will not add any new prefixes.  
      remove: false,
      //By default, Autoprefixer also removes outdated prefixes.
      //You can disable this behavior with the remove: false option. 
      //If you have no legacy code, this option will make Autoprefixer about 10% faster.  
      support: true,
      //should Autoprefixer add prefixes for @supports parameters.  
      flexbox: true,
      //should Autoprefixer add prefixes for flexbox properties. With "no-2009" 
      //value Autoprefixer will add prefixes only for final and IE versions of specification. Default is true.
      grid: true
    }
  }, {
    loader: require.resolve('sass-loader'),
    options: {}
  }])
},
//if filename is suffixed with just only css, then we will not open css module
{
  test: function test(filePath) {
    return (/\.css$/.test(filePath) && !/\.module\.css$/.test(filePath)
    );
  },

  use: _extractTextWebpackPlugin2.default.extract([{
    loader: require.resolve('css-loader'),
    options: {
      sourceMap: true,
      //the extract-text-webpack-plugin can handle them.
      minimize: true,
      //You can also disable or enforce minification with the minimize query parameter.
      camelCase: false
    }
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      //browsers (array): list of browsers query (like last 2 version), which are supported in 
      //your project. We recommend to use browserslist config or browserslist key in package.json, 
      //rather than this option to share browsers with other tools. See Browserslist docs for available queries and default value.
      cascade: true,
      //then beatified as follows with right indent
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg); 
      add: false,
      //Autoprefixer will only clean outdated prefixes, but will not add any new prefixes.  
      remove: false,
      //By default, Autoprefixer also removes outdated prefixes.
      //You can disable this behavior with the remove: false option. 
      //If you have no legacy code, this option will make Autoprefixer about 10% faster.  
      support: true,
      //should Autoprefixer add prefixes for @supports parameters.  
      flexbox: true,
      //should Autoprefixer add prefixes for flexbox properties. With "no-2009" 
      //value Autoprefixer will add prefixes only for final and IE versions of specification. Default is true.
      grid: true
    }
  }])
}, {
  test: function test(filePath) {
    return (/\.less$/.test(filePath) && !/\.module\.less$/.test(filePath)
    );
  },

  use: _extractTextWebpackPlugin2.default.extract([{
    loader: require.resolve('css-loader'),
    options: {
      sourceMap: true,
      //the extract-text-webpack-plugin can handle them.
      minimize: true,
      //You can also disable or enforce minification with the minimize query parameter.
      camelCase: false
    }
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      //browsers (array): list of browsers query (like last 2 version), which are supported in 
      //your project. We recommend to use browserslist config or browserslist key in package.json, 
      //rather than this option to share browsers with other tools. See Browserslist docs for available queries and default value.
      cascade: true,
      //then beatified as follows with right indent
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg); 
      add: false,
      //Autoprefixer will only clean outdated prefixes, but will not add any new prefixes.  
      remove: false,
      //By default, Autoprefixer also removes outdated prefixes.
      //You can disable this behavior with the remove: false option. 
      //If you have no legacy code, this option will make Autoprefixer about 10% faster.  
      support: true,
      //should Autoprefixer add prefixes for @supports parameters.  
      flexbox: true,
      //should Autoprefixer add prefixes for flexbox properties. With "no-2009" 
      //value Autoprefixer will add prefixes only for final and IE versions of specification. Default is true.
      grid: true
    }
  }, {
    loader: require.resolve('less-loader'),
    options: {
      sourceMap: true,
      lessPlugins: []
      //sourcemaps are only available in conjunction with the extract-text-webpack-plugin
      // modifyVars: JSON.stringify(theme)
      //using theme config in package.json to modify default less variables
    }
  }])
}, {
  test: function test(filePath) {
    return (/\.scss$/.test(filePath) && !/\.module\.scss$/.test(filePath)
    );
  },

  use: _extractTextWebpackPlugin2.default.extract([{
    loader: require.resolve('css-loader'),
    options: {
      sourceMap: true,
      //the extract-text-webpack-plugin can handle them.
      minimize: true,
      //You can also disable or enforce minification with the minimize query parameter.
      camelCase: false
    }
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      //browsers (array): list of browsers query (like last 2 version), which are supported in 
      //your project. We recommend to use browserslist config or browserslist key in package.json, 
      //rather than this option to share browsers with other tools. See Browserslist docs for available queries and default value.
      cascade: true,
      //then beatified as follows with right indent
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg); 
      add: false,
      //Autoprefixer will only clean outdated prefixes, but will not add any new prefixes.  
      remove: false,
      //By default, Autoprefixer also removes outdated prefixes.
      //You can disable this behavior with the remove: false option. 
      //If you have no legacy code, this option will make Autoprefixer about 10% faster.  
      support: true,
      //should Autoprefixer add prefixes for @supports parameters.  
      flexbox: true,
      //should Autoprefixer add prefixes for flexbox properties. With "no-2009" 
      //value Autoprefixer will add prefixes only for final and IE versions of specification. Default is true.
      grid: true
    }
  }, {
    loader: require.resolve('sass-loader'),
    options: {}
  }])
}];

//in development mode, we will not extract css/less/scss file from entry file.
var development = [{
  test: /\.module\.scss$/i,
  use: [{
    loader: require.resolve("style-loader"),
    options: {}
  }, {
    loader: require.resolve("css-loader"),
    options: {
      modules: true,
      //enable css module,You can switch it off with :global(...) or :global for selectors and/or rules.
      localIdentName: '[path][name]__[local]--[hash:base64:5]',
      //path will be replaced by file path(foler path relative to project root)
      //name will be replaced by file name
      //local will be replaced by local class name
      sourceMap: true,
      //the extract-text-webpack-plugin can handle them.
      importLoaders: 1,
      // That many loaders after the css-loader are used to import resources.
      minimize: true,
      //You can also disable or enforce minification with the minimize query parameter.
      camelCase: false
    }
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      //browsers (array): list of browsers query (like last 2 version), which are supported in 
      //your project. We recommend to use browserslist config or browserslist key in package.json, 
      //rather than this option to share browsers with other tools. See Browserslist docs for available queries and default value.
      cascade: true,
      //then beatified as follows with right indent
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg); 
      add: false,
      //Autoprefixer will only clean outdated prefixes, but will not add any new prefixes.  
      remove: false,
      //By default, Autoprefixer also removes outdated prefixes.
      //You can disable this behavior with the remove: false option. 
      //If you have no legacy code, this option will make Autoprefixer about 10% faster.  
      support: true,
      //should Autoprefixer add prefixes for @supports parameters.  
      flexbox: true,
      //should Autoprefixer add prefixes for flexbox properties. With "no-2009" 
      //value Autoprefixer will add prefixes only for final and IE versions of specification. Default is true.
      grid: true
    }
  }, {
    loader: require.resolve("sass-loader"),
    options: {}
  }]
}, {
  test: /\.module\.less$/i,
  use: [{
    loader: require.resolve("style-loader"),
    options: {}
  }, {
    loader: require.resolve("css-loader"),
    options: {
      modules: true,
      //enable css module,You can switch it off with :global(...) or :global for selectors and/or rules.
      localIdentName: '[path][name]__[local]--[hash:base64:5]',
      //path will be replaced by file path(foler path relative to project root)
      //name will be replaced by file name
      //local will be replaced by local class name
      sourceMap: true,
      //the extract-text-webpack-plugin can handle them.
      importLoaders: 1,
      // That many loaders after the css-loader are used to import resources.
      minimize: true,
      //You can also disable or enforce minification with the minimize query parameter.
      camelCase: false
    }
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      //browsers (array): list of browsers query (like last 2 version), which are supported in 
      //your project. We recommend to use browserslist config or browserslist key in package.json, 
      //rather than this option to share browsers with other tools. See Browserslist docs for available queries and default value.
      cascade: true,
      //then beatified as follows with right indent
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg); 
      add: false,
      //Autoprefixer will only clean outdated prefixes, but will not add any new prefixes.  
      remove: false,
      //By default, Autoprefixer also removes outdated prefixes.
      //You can disable this behavior with the remove: false option. 
      //If you have no legacy code, this option will make Autoprefixer about 10% faster.  
      support: true,
      //should Autoprefixer add prefixes for @supports parameters.  
      flexbox: true,
      //should Autoprefixer add prefixes for flexbox properties. With "no-2009" 
      //value Autoprefixer will add prefixes only for final and IE versions of specification. Default is true.
      grid: true
    }
  }, {
    loader: require.resolve("less-loader"),
    options: {
      sourceMap: true,
      lessPlugins: []
      //sourcemaps are only available in conjunction with the extract-text-webpack-plugin
      // modifyVars: JSON.stringify(theme)
      //using theme config in package.json to modify default less variables
    }
  }]
}, {
  test: /\.module\.css$/i,
  use: [{
    loader: require.resolve("style-loader"),
    options: {}
  }, {
    loader: require.resolve("css-loader"),
    options: {
      modules: true,
      //enable css module,You can switch it off with :global(...) or :global for selectors and/or rules.
      localIdentName: '[path][name]__[local]--[hash:base64:5]',
      //path will be replaced by file path(foler path relative to project root)
      //name will be replaced by file name
      //local will be replaced by local class name
      sourceMap: true,
      //the extract-text-webpack-plugin can handle them.
      importLoaders: 1,
      // That many loaders after the css-loader are used to import resources.
      minimize: true,
      //You can also disable or enforce minification with the minimize query parameter.
      camelCase: false
    }
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      //browsers (array): list of browsers query (like last 2 version), which are supported in 
      //your project. We recommend to use browserslist config or browserslist key in package.json, 
      //rather than this option to share browsers with other tools. See Browserslist docs for available queries and default value.
      cascade: true,
      //then beatified as follows with right indent
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg); 
      add: false,
      //Autoprefixer will only clean outdated prefixes, but will not add any new prefixes.  
      remove: false,
      //By default, Autoprefixer also removes outdated prefixes.
      //You can disable this behavior with the remove: false option. 
      //If you have no legacy code, this option will make Autoprefixer about 10% faster.  
      support: true,
      //should Autoprefixer add prefixes for @supports parameters.  
      flexbox: true,
      //should Autoprefixer add prefixes for flexbox properties. With "no-2009" 
      //value Autoprefixer will add prefixes only for final and IE versions of specification. Default is true.
      grid: true
    }
  }]
},
//If just suffixed with css, then we will not open css module
{
  test: function test(filePath) {
    return (/\.scss$/.test(filePath) && !/\.module\.scss$/.test(filePath)
    );
  },

  use: [{
    loader: require.resolve("style-loader"),
    options: {}
  }, {
    loader: require.resolve("css-loader"),
    options: {
      sourceMap: true,
      //the extract-text-webpack-plugin can handle them.
      minimize: true,
      //You can also disable or enforce minification with the minimize query parameter.
      camelCase: false
    }
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      //browsers (array): list of browsers query (like last 2 version), which are supported in 
      //your project. We recommend to use browserslist config or browserslist key in package.json, 
      //rather than this option to share browsers with other tools. See Browserslist docs for available queries and default value.
      cascade: true,
      //then beatified as follows with right indent
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg); 
      add: false,
      //Autoprefixer will only clean outdated prefixes, but will not add any new prefixes.  
      remove: false,
      //By default, Autoprefixer also removes outdated prefixes.
      //You can disable this behavior with the remove: false option. 
      //If you have no legacy code, this option will make Autoprefixer about 10% faster.  
      support: true,
      //should Autoprefixer add prefixes for @supports parameters.  
      flexbox: true,
      //should Autoprefixer add prefixes for flexbox properties. With "no-2009" 
      //value Autoprefixer will add prefixes only for final and IE versions of specification. Default is true.
      grid: true
    }
  }, {
    loader: require.resolve("sass-loader"),
    options: {}
  }]
}, {
  test: function test(filePath) {
    return (/\.less$/.test(filePath) && !/\.module\.less$/.test(filePath)
    );
  },

  use: [{
    loader: require.resolve("style-loader"),
    options: {}
  }, {
    loader: require.resolve("css-loader"),
    options: {
      sourceMap: true,
      // That many loaders after the css-loader are used to import resources.
      minimize: true,
      //You can also disable or enforce minification with the minimize query parameter.
      camelCase: false
    }
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      //browsers (array): list of browsers query (like last 2 version), which are supported in 
      //your project. We recommend to use browserslist config or browserslist key in package.json, 
      //rather than this option to share browsers with other tools. See Browserslist docs for available queries and default value.
      cascade: true,
      //then beatified as follows with right indent
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg); 
      add: false,
      //Autoprefixer will only clean outdated prefixes, but will not add any new prefixes.  
      remove: false,
      //By default, Autoprefixer also removes outdated prefixes.
      //You can disable this behavior with the remove: false option. 
      //If you have no legacy code, this option will make Autoprefixer about 10% faster.  
      support: true,
      //should Autoprefixer add prefixes for @supports parameters.  
      flexbox: true,
      //should Autoprefixer add prefixes for flexbox properties. With "no-2009" 
      //value Autoprefixer will add prefixes only for final and IE versions of specification. Default is true.
      grid: true
    }
  }, {
    loader: require.resolve("less-loader"),
    options: {
      sourceMap: true,
      lessPlugins: []
      //sourcemaps are only available in conjunction with the extract-text-webpack-plugin
      // modifyVars: JSON.stringify(theme)
      //using theme config in package.json to modify default less variables
    }
  }]
}, {
  test: function test(filePath) {
    return (/\.css$/.test(filePath) && !/\.module\.css$/.test(filePath)
    );
  },

  use: [{
    loader: require.resolve("style-loader"),
    options: {}
  }, {
    loader: require.resolve("css-loader"),
    options: {
      sourceMap: true,
      //the extract-text-webpack-plugin can handle them.
      minimize: true,
      //You can also disable or enforce minification with the minimize query parameter.
      camelCase: false
    }
  }, {
    loader: require.resolve('postcss-loader'),
    options: {
      browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
      //browsers (array): list of browsers query (like last 2 version), which are supported in 
      //your project. We recommend to use browserslist config or browserslist key in package.json, 
      //rather than this option to share browsers with other tools. See Browserslist docs for available queries and default value.
      cascade: true,
      //then beatified as follows with right indent
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg); 
      add: false,
      //Autoprefixer will only clean outdated prefixes, but will not add any new prefixes.  
      remove: false,
      //By default, Autoprefixer also removes outdated prefixes.
      //You can disable this behavior with the remove: false option. 
      //If you have no legacy code, this option will make Autoprefixer about 10% faster.  
      support: true,
      //should Autoprefixer add prefixes for @supports parameters.  
      flexbox: true,
      //should Autoprefixer add prefixes for flexbox properties. With "no-2009" 
      //value Autoprefixer will add prefixes only for final and IE versions of specification. Default is true.
      grid: true
    }
  }]
}];

function updateRules(wpOpt, isDev) {
  if (isDev) {
    for (var i = 0; i < development.length; i++) {
      wpOpt.module.rules.push(development[i]);
    }
  } else {
    for (var j = 0; j < production.length; j++) {
      wpOpt.module.rules.push(production[j]);
    }
  }
  return wpOpt;
}
module.exports = exports['default'];