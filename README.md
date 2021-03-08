# Decora

[![NPM Badge](https://img.shields.io/npm/v/@namchee/decora)](https://www.npmjs.com/package/@namchee/decora)

Useful ECMAScript decorator for any development needs. Compatible with both browser and NodeJS environment.

Although it's written in [TypeScript](https://www.typescriptlang.org/), these decorators should be compatible with normal JS files as long as the environment support ES7 standard.

Will be updated indefinitely.

## Installation

`npm install @namchee/decora`

### TypeScript

Remember to toggle the `experimentalDecorators` option to `true` in your `tsconfig.json`

```json
{
  // ...
  "experimentalDecorators": true
}
```

### JavaScript

Install [`@babel/plugin-proposal-decorators`](https://www.npmjs.com/package/@babel/plugin-proposal-decorators) and add it to your [Babel configuration](https://babeljs.io/docs/en/configuration)

## `@benchmark`

**Decorator Type**: Method decorator

Add benchmarking functionality to a method from a class. Benchmark result will be written to `console`.

> Will transform the decorated function into an asynchronous function.

```ts
class Example {
  @benchmark()
  logMe() {
    console.log('test');
  }
}
```

### Parameters

**Name** | **Required?** | **Values** | **Default Value** | **Description**
---- | --------- | ------ | ------------- | -----------
`metric` | `false` | `['s', 'ms', 'ns']` | `'ms'` | Metric to be used when logging function runtime
`precision` | `false` | `number, n > 1` | `undefined` | Number of digits after comma. Passing `undefined` will print an abruptly long string.
`stream` | `true` | `NodeJS.WritableStream` | `process.stdout` | Destination for the log to be written to. [Detailed Explanation](https://nodejs.org/api/stream.html#stream_writable_streams). This option is **ONLY** available on NodeJS environment.
## `@timeout`

**Decorator Type**: Method decorator

Limits a function execution time to a certain time limit. Will throw an error if timeout value exceeded.

> Will transform the decorated function into an asynchronous function.

```ts
class Example {
  @benchmark(1000)
  timeoutMe() {
    setTimeoutPromise(5000); // will throw an error
  }
}
```

### Parameters

**Name** | **Required?** | **Values** | **Default Value** | **Description**
---- | --------- | ------ | ------------- | -----------
`time` | `true` | `number` | `-` | Time limit for the function
`metric` | `false` | `['s', 'ms', 'ns']` | `'ms'` | Metric to be used when logging function runtime

## `@bind`

**Decorator Type**: Method decorator

Binds a class method to a `this` context.

```ts
class Example {
  value = 5;

  @bind()
  bindedMethod() {
    return this.value;
  }
}

const value = new Example().bindedMethod(); // will return `5` instead of `undefined`
```

### Parameters

**Name** | **Required?** | **Values** | **Default Value** | **Description**
---- | --------- | ------ | ------------- | -----------
`context` | `false` | `any` | `this` | Method's execution context
