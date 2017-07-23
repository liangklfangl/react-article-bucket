'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _DocumentContext = require('./DocumentContext');

var _DocumentContext2 = _interopRequireDefault(_DocumentContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var hasConsole = typeof window !== 'undefined' && window.console;
var noop = function noop() {};
var swallowInvalidHeadWarning = noop;
var resetWarnings = noop;

if (hasConsole) {
  (function () {
    var originalError = console.error; // eslint-disable-line no-console
    // Rendering a <head> into a body is technically invalid although it
    // works. We swallow React's validateDOMNesting warning if that is the
    // message to avoid confusion
    swallowInvalidHeadWarning = function swallowInvalidHeadWarning() {
      console.error = function (msg) {
        // eslint-disable-line no-console
        if (/<head>/.test(msg)) return;
        originalError.call(console, msg);
      };
    };
    resetWarnings = function resetWarnings() {
      return console.error = originalError;
    }; // eslint-disable-line no-console
  })();
}

var Frame = function (_Component) {
  _inherits(Frame, _Component);

  // React warns when you render directly into the body since browser extensions
  // also inject into the body and can mess up React. For this reason
  // initialContent is expected to have a div inside of the body
  // element that we render react into.
  function Frame(props, context) {
    _classCallCheck(this, Frame);

    var _this = _possibleConstructorReturn(this, (Frame.__proto__ || Object.getPrototypeOf(Frame)).call(this, props, context));

    _this._isMounted = false;
    return _this;
  }

  _createClass(Frame, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._isMounted = true;
      this.renderFrameContents();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.renderFrameContents();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._isMounted = false;
      var doc = this.getDoc();
      if (doc) {
        _reactDom2.default.unmountComponentAtNode(this.getMountTarget());
      }
    }
  }, {
    key: 'getDoc',
    value: function getDoc() {
      return _reactDom2.default.findDOMNode(this).contentDocument; // eslint-disable-line
    }
  }, {
    key: 'getMountTarget',
    value: function getMountTarget() {
      var doc = this.getDoc();
      if (this.props.mountTarget) {
        return doc.querySelector(this.props.mountTarget);
      }
      return doc.body.children[0];
    }
  }, {
    key: 'renderFrameContents',
    value: function renderFrameContents() {
      if (!this._isMounted) {
        return;
      }

      var doc = this.getDoc();
      if (doc && doc.readyState === 'complete') {
        if (doc.querySelector('div') === null) {
          this._setInitialContent = false;
        }

        var win = doc.defaultView || doc.parentView;
        var initialRender = !this._setInitialContent;
        var contents = _react2.default.createElement(
          _DocumentContext2.default,
          { document: doc, window: win },
          _react2.default.createElement(
            'div',
            { className: 'frame-content' },
            this.props.head,
            this.props.children
          )
        );

        if (initialRender) {
          doc.open('text/html', 'replace');
          doc.write(this.props.initialContent);
          doc.close();
          this._setInitialContent = true;
        }

        swallowInvalidHeadWarning();

        // unstable_renderSubtreeIntoContainer allows us to pass this component as
        // the parent, which exposes context to any child components.
        var callback = initialRender ? this.props.contentDidMount : this.props.contentDidUpdate;
        var mountTarget = this.getMountTarget();

        _reactDom2.default.unstable_renderSubtreeIntoContainer(this, contents, mountTarget, callback);
        resetWarnings();
      } else {
        setTimeout(this.renderFrameContents.bind(this), 0);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var props = _extends({}, this.props, {
        children: undefined // The iframe isn't ready so we drop children from props here. #12, #17
      });
      delete props.head;
      delete props.initialContent;
      delete props.mountTarget;
      delete props.contentDidMount;
      delete props.contentDidUpdate;
      return _react2.default.createElement('iframe', props);
    }
  }]);

  return Frame;
}(_react.Component);

Frame.propTypes = {
  style: _propTypes2.default.object, // eslint-disable-line
  head: _propTypes2.default.node,
  initialContent: _propTypes2.default.string,
  mountTarget: _propTypes2.default.string,
  contentDidMount: _propTypes2.default.func,
  contentDidUpdate: _propTypes2.default.func,
  children: _propTypes2.default.oneOfType([_propTypes2.default.element, _propTypes2.default.arrayOf(_propTypes2.default.element)])
};
Frame.defaultProps = {
  style: {},
  head: null,
  children: undefined,
  mountTarget: undefined,
  contentDidMount: function contentDidMount() {},
  contentDidUpdate: function contentDidUpdate() {},
  initialContent: '<!DOCTYPE html><html><head></head><body><div class="frame-root"></div></body></html>'
};
exports.default = Frame;