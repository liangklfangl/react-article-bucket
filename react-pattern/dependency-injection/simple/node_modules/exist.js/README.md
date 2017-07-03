# exist.js

[![](https://img.shields.io/travis/benjycui/exist.js.svg?style=flat-square)](https://travis-ci.org/benjycui/exist.js)
[![npm package](https://img.shields.io/npm/v/exist.js.svg?style=flat-square)](https://www.npmjs.org/package/exist.js)
[![NPM downloads](http://img.shields.io/npm/dm/exist.js.svg?style=flat-square)](https://npmjs.org/package/exist.js)
[![Dependency Status](https://david-dm.org/benjycui/exist.js.svg?style=flat-square)](https://david-dm.org/benjycui/exist.js)

If you are tired of those:

```js
// To get `name`, but you do not know whether `employees` and `employees[0]` exist or not
const name = (company.employees && company.employees[0] && company.employees[0].name);

// To set `name`, but you do not know whether `employees` and `employees[0]` exist or not
if (company.employees && company.employees[0]) {
  company.employees[0].name = 'Benjy';
}

// To call a method of nested `Object`
if (company.employees && company.employees[0] && (typeof company.employees[0].getName === 'function')) {
  var name = company.employees[0].getName();
}
```

You can try **exist.js**. Something inspired by the existential operator(`?.` & `?()`) of [CoffeeScript](http://coffeescript.org/), but not the same as it. With **exist.js**, you can access nested property easily:

```js
// To get `name`, but you do not know whether `employees` and `employees[0]` exist or not
const name = exist.get(company, 'employees[0].name');

// To set `name`, but you do not know whether `employees` and `employees[0]` exist or not
exist.set(company, 'employees[0].name', 'Benjy');

// To call a method of nested `Object`
exist.invoke(company, 'employees[0].getName')();
```

## Performance

Maybe you already know [lodash](https://github.com/lodash/lodash)'s `has` and `get`, but **exist.js** is faster. You can run `npm install && node ./perf.js` to prove.

## Getting Started

Install exist.js as an npm module and save it to your package.json file as a dependency:

```bash
npm install exist.js --save
```

Once installed, it can now be referenced and used easily:

```js
const exist = require('exist.js');
exist({}, 'name') // => false
```


## API

### exist.detect(obj, nestedProp)

> (Object, String|Array) -> true | Array

To check whether a nested property exists in `Object` or not. If the nested property is exist, return `true`. Otherwise, return the path to the property where the value starts missing.

```js
const company = {
  employees: [
    {
      name: 'Benjy'
    }
  ]
};

exist(company, 'employees[0].name') // => true
exist(company, ['bosses', '0', 'age']) // => ['bosses']
```


### exist.get(obj, nestedProp[, defaultValue])

> (Object, String|Array[, anything]) -> undefined | value

To get a nested property. If this property does not exist, return `undefined` or `defaultValue`.

```js
const company = {
  employees: [
    {
      name: 'Benjy'
    }
  ]
};

exist.get(company, 'employees[0].name') // => 'Benjy'
exist.get(company, 'employees[0].age') // => undefined
exist.get(company, ['employees', '0', 'age'], 18) // => 18
```


### exist.set(obj, nestedProp, value[, createMissing])

> (Object, String|Array, anything[, boolean]) -> boolean

To set a value to nested property. If success, return `true`. Otherwise, `false`.

If `createMissing` is `true`, `exist.set` will create plain objects and replace missing parts with them, so the value will be set correctly and return `true`.

```js
const company = {
  employees: [{}]
};

exist.set(company, 'employees[0].name', 'Benjy') // => true
exist.set(company, ['stockholders', '0', 'name'], 'Benjy') // => false, for `stockholders` does not exist

// After this call, company is `{ ..., stockholders: { 0: { name: 'Benjy' } } }`
exist.set(company, ['stockholders', '0', 'name'], 'Benjy', true)
```


### exist.invoke(obj, nestedMethod)

> (Object, String|Array) -> Function

To get a nested method, or return NOOP(`function() {}`) if this property does not exist.

```js
const company = {
  employees: [
    {
      name: 'Benjy',
      sayHi: function(name) {
        console.log('Nice to meet you, ' + name + '!');
      }
    }
  ]
};

exist.invoke(company, 'employees[0].sayHi')('Bob') // => 'Nice to meet you, Bob!'
exist.invoke(company, ['employees', '0', 'sayHello'])('Bob') // => Nothing will happen
```

## License

MIT
