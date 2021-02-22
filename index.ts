import { benchmark as benchmarkFn } from './src/benchmark';
import { timeout as timeoutFn } from './src/timeout';

export const benchmark = benchmarkFn;
export const timeout = timeoutFn;

export default {
  benchmark: benchmarkFn,
  timeout: timeoutFn,
};
