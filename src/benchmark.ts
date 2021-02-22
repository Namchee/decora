import { Console } from 'console';
import { performance } from 'perf_hooks';

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
        /* eslint-disable-next-line */
        `Function ${keyName} from class ${target.constructor.name} was executed in ${diff.toFixed(precision)} ${metric}`,
      );

      return result;
    };
  };
}
