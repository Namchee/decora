# Decorator Ku

Useful ECMAScript decorator for personal purposes.

Although it's written in [TypeScript](https://www.typescriptlang.org/), these decorators should be compatible with normal JS files as long as it supports ES7.

Will be updated indefinitely.

## `@benchmark`

**Decorator Type**: Method decorator

Add benchmarking functionality to a method from a class. Benchmark result will be written to `console`.

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
