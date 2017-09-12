import React from "react";

import ReactDOM from "react-dom";

import Prism from "prismjs";

import PrismCode from "./PrismCode";

describe(`PrismCode`, () => {
  beforeAll(() => {
    global.Prism = Prism;
  });

  afterAll(() => {
    delete global.Prism;
  });

  let dom;

  beforeEach(() => {
    dom = document.createElement(`div`);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(dom);
  });

  it(`should render original code in the first run`, () => {
    ReactDOM.render(
      <PrismCode className="language-javascript">
        require("react/addons").addons.TestUtils.renderIntoDocument(/* wtf ?*/);
      </PrismCode>,
      dom,
    );

    expect(dom.textContent).toEqual(
      `require("react/addons").addons.TestUtils.renderIntoDocument(/* wtf ?*/);`,
    );
  });

  it(`should render hightlighted code in the second run`, () => {
    ReactDOM.render(
      <PrismCode className="language-javascript">
        var React, TestUtils;
      </PrismCode>,
      dom,
    );

    // FIXME: exact content here
    expect(dom.textContent).not.toEqual(
      `require("react/addons").addons.TestUtils.renderIntoDocument(/* wtf ?*/);`,
    );
  });
});
