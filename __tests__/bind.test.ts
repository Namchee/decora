import { bind } from '../src/bind';

describe('@bind', function() {
  it('should throw an error when applied to non-function property', function() {
    try {
      class Test {
        @bind()
        test: number = 5;
      }

      new Test();

      throw new Error(
        'Should throw an error as it is binded to a non-function property',
      );
    } catch (err) {
      expect(err.message).toBe('@bind can only be applied to class methods');
    }
  });

  it('should bind values correctly', function() {
    class Test {
      value = 1;

      @bind()
      test() {
        return this.value;
      }
    }

    const returnValue = new Test().test();

    expect(returnValue).toBe(1);
  });

  it('should binds to custom context when parameter is provided', function() {
    const context = {
      value: 2,
    };

    class Test {
      value = 1;

      @bind(context)
      test() {
        return this.value;
      }
    }

    const value = new Test().test();

    expect(value).toBe(2);
  });
});
