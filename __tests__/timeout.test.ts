import { timeout } from './../src/timeout';

jest.useFakeTimers();

describe('@timeout', () => {
  it('should pass', async () => {
    class Test {
      @timeout(5000)
      test() {
        return 0;
      }
    }

    const obj = new Test();
    const result = await obj.test();
    expect(result).toBe(0);
  });

  it(
    'should throw an error when the decorator is not applied to a function',
    async () => {
      try {
        class Test {
          @timeout(5000)
          test: number = 5000;
        }

        new Test();

        throw new Error(
          'Test should fail as the decorator is not applied to a function',
        );
      } catch (err) {
        expect((err as Error).message)
          .toBe('@timeout decorator can only be applied to class methods');
      }
    });

  it('should throw an error when the function timeouts', async () => {
    class Test {
      @timeout(1999)
      test() {
        return new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    try {
      await new Test().test();
    } catch (err) {
      expect((err as Error).message)
        .toBe('Function test from class Test exceeds time limit of 1999 ms');
    }
  });
});
