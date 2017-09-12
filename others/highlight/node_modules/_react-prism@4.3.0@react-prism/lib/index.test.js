"use strict";

var _index = require("./index");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("index", function () {
  it("should export components", function () {
    expect(_index2.default).toBeDefined();
    expect(_index.PrismCode).toBeDefined();
  });
});