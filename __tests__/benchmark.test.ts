import { benchmark } from './../src/benchmark';

const consoleSpy = jest.fn(() => {});

jest.mock('console', () => {
  return {
    Console: jest.fn().mockImplementation(() => {
      return {
        info: consoleSpy,
      };
    }),
  };
});

describe('@benchmark', () => {
  it('should pass', async () => {
    class Test {
      @benchmark()
      test() {
        return 0;
      }
    }

    const obj = new Test();
    const result = await obj.test();

    expect(result).toBe(0);
    expect(consoleSpy).toBeCalledTimes(1);
  });

  it(
    /* eslint-disable-next-line */
    'should throw an error when the decorator is applied to a non-function property',
    () => {
      try {
        class Test {
          @benchmark()
          test: number = 1234;
        }

        new Test();

        throw new Error(
          'Test should fail as the decorator is not applied to a function',
        );
      } catch (err) {
        expect((err as Error).message)
          .toBe('@benchmark decorator can only be applied to functions');
      }
    },
  );

  afterEach(() => {
    jest.resetAllMocks();
  });
});
