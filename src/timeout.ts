const timeoutSymbol = Symbol('timeout');

/**
 * Limits function execution to a specific time limit, otherwise
 * it will throw an `Error`
 *
 * @param {number} - time limit, in the supplied metric
 * @param {'s' | 'ms' | 'ns'} - time metric to be used. Defaults to 'ms'
 */
export function timeout(
  time: number,
  metric: 's' | 'ms' | 'ns' = 'ms',
): Function {
  return function(
    target: any,
    keyName: string,
    descriptor: PropertyDescriptor,
  ) {
    if (!descriptor || !(descriptor.value instanceof Function)) {
      throw new Error(
        '@timeout decorator can only be applied to class methods',
      );
    }

    const fn: Function = descriptor.value;

    if (metric !== 'ms') {
      time = metric === 's' ?
        time / 1000 :
        time * 1000;
    }

    descriptor.value = async function(...args: any[]) {
      const timeoutFn = Promise.resolve(
        setTimeout(() => timeoutSymbol, time),
      );

      const result = await Promise.race([
        fn.apply(this, args),
        timeoutFn,
      ]);

      if (typeof result === 'symbol' && result === timeoutSymbol) {
        throw new Error(
          /* eslint-disable-next-line */
          `Function ${keyName} from class ${target.constructor.name} exceeds time limit of ${time} ms`,
        );
      }

      return result;
    };
  };
}
