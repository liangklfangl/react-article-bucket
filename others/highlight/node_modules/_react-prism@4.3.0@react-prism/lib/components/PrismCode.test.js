"use strict";

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _prismjs = require("prismjs");

var _prismjs2 = _interopRequireDefault(_prismjs);

var _PrismCode = require("./PrismCode");

var _PrismCode2 = _interopRequireDefault(_PrismCode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("PrismCode", function () {
  beforeAll(function () {
    global.Prism = _prismjs2.default;
  });

  afterAll(function () {
    delete global.Prism;
  });

  var dom = void 0;

  beforeEach(function () {
    dom = document.createElement("div");
  });

  afterEach(function () {
    _reactDom2.default.unmountComponentAtNode(dom);
  });

  it("should render original code in the first run", function () {
    _reactDom2.default.render(_react2.default.createElement(
      _PrismCode2.default,
      { className: "language-javascript" },
      "require(\"react/addons\").addons.TestUtils.renderIntoDocument(/* wtf ?*/);"
    ), dom);

    expect(dom.textContent).toEqual("require(\"react/addons\").addons.TestUtils.renderIntoDocument(/* wtf ?*/);");
  });

  it("should render hightlighted code in the second run", function () {
    _reactDom2.default.render(_react2.default.createElement(
      _PrismCode2.default,
      { className: "language-javascript" },
      "var React, TestUtils;"
    ), dom);

    // FIXME: exact content here
    expect(dom.textContent).not.toEqual("require(\"react/addons\").addons.TestUtils.renderIntoDocument(/* wtf ?*/);");
  });
});