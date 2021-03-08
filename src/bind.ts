/**
 * Binds method context with the provided reference
 *
 * @param {Object?} reference - method's context. Default to `this`
 */
export function bind(reference?: Object): Function {
  return function(
    target: Object,
    keyName: string,
    descriptor: PropertyDescriptor,
  ): Object {
    if (!descriptor || !(descriptor.value instanceof Function)) {
      throw new Error('@bind can only be applied to class methods');
    }

    return {
      get() {
        const that = reference || this;

        return (descriptor.value as Function).bind(that);
      },
    };
  };
}
