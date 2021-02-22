import { Console } from 'console';
import { performance } from 'perf_hooks';

const timeoutSymbol = Symbol('timeout');

/**
 * Apply simple benchmarking to a method,
 * which will logged to `console`.
 * @param {'s' | 'ms' | 'ms'} metric - time metric to be used.
 * Defaults to `ms`
 * @param {number?} precision - time precision to be shown on
 * log. Passing `undefined` will log an abruptly long number string.
 * @return {Function} - modified function with benchmark capabilities
 */
export function benchmark(
  metric: 's' | 'ms' | 'ns' = 'ms',
  precision?: number,
  stream: NodeJS.WritableStream = process.stdout,
): Function {
  return function(
    target: Object,
    keyName: string,
    descriptor: PropertyDescriptor,
  ): void {
    if (!descriptor || !(descriptor.value instanceof Function)) {
      throw new Error(
        '@benchmark decorator can only be applied to functions',
      );
    }

    const logger = new Console({ stdout: stream });

    const fn: Function = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      const start = performance.now();

      const result = await fn.apply(this, args);

      const end = performance.now();
      let diff = end - start;

      if (metric !== 'ms') {
        diff = metric === 's' ?
          diff / 1000 :
          diff * 1000;
      }

      logger.info(
        `Function ${keyName} from class ${target.constructor.name} was executed in ${diff.toFixed(precision)} ${metric}`,
      );

      return result;
    };
  }
}

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
        '@timeout decorator can only be applied to functions',
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
          `Function ${keyName} from class ${target.constructor.name} exceeds time limit of ${time} ms`,
        )
      }

      return result;
    }
  }
}
