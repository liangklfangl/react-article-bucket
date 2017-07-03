'use strict';

var _babelTemplate = require('babel-template');

var _babelTemplate2 = _interopRequireDefault(_babelTemplate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  visitor: {
    Program: {
      exit: function exit(path) {
        if (path.BABEL_PLUGIN_ADD_MODULE_EXPORTS) {
          return;
        }

        var hasExportDefault = false;
        var hasExportNamed = false;
        path.get('body').forEach(function (path) {
          if (path.isExportDefaultDeclaration()) {
            hasExportDefault = true;
            return;
          }
          if (path.isExportNamedDeclaration()) {
            // HACK detect export-from statements for default
            var specifiers = path.get('declaration').container.specifiers;
            var isDefaultExportDeclaration = specifiers.length === 1 && specifiers[0].exported.name === 'default';
            if (isDefaultExportDeclaration) {
              hasExportDefault = true;
            } else {
              hasExportNamed = true;
            }
            return;
          }
        });

        if (hasExportDefault && !hasExportNamed) {
          var topNodes = [];
          topNodes.push((0, _babelTemplate2.default)("module.exports = exports['default']")());

          path.pushContainer('body', topNodes);
        }

        path.BABEL_PLUGIN_ADD_MODULE_EXPORTS = true;
      }
    }
  }
};
//# sourceMappingURL=index.js.map