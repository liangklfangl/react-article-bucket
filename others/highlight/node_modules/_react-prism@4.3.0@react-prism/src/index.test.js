import PrismCode, { PrismCode as NamedPrismCode } from "./index";

describe(`index`, () => {
  it(`should export components`, () => {
    expect(PrismCode).toBeDefined();
    expect(NamedPrismCode).toBeDefined();
  });
});
