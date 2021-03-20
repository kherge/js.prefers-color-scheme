/**
 * Defines how mockMatchMedia must be built.
 */
export interface Builder {
  /**
   * Creates a new mock and sets it as the `addEventListener` method for the new implementation.
   *
   * If event listeners are being used with `MediaQueryList`, you will need a way to recognize
   * that listeners as being added. This method will ensure that the `matchMedia` mock uses the
   * generated mock function as the implementation and then return it for checking.
   *
   * ```ts
   * const mockAddEventListener = matchMedia.addEventListener();
   *
   * // ... run code ...
   *
   * expect(mockAddEventListener).toHaveBeenCalled();
   * ```
   *
   * @return The mock.
   */
  addEventListener(): jest.Mock;

  /**
   * Sets the implementation for `window.matchMedia` to be used many times.
   *
   * Equivalent to calling `jest.mockImplementation()`.
   */
  many(): void;

  /**
   * Sets the `matches` value for the new implementation.
   *
   * @param matches The value.
   *
   * @return The builder for method chaining.
   */
  matches(matches: boolean): Builder;

  /**
   * Sets the implementation for `window.matchMedia` to be used exactly once.
   *
   * Equivalent to calling `jest.mockImplementationOnce()`.
   */
  once(): void;

  /**
   * Creates a new mock and sets it as the `removeEventListener` method for the new implementation.
   *
   * ```ts
   * const mockRemoveEventListener = matchMedia.removeEventListener();
   *
   * // ... run code ...
   *
   * expect(mockRemoveEventListener).toHaveBeenCalled();
   * ```
   *
   * @return The mock.
   */
  removeEventListener(): jest.Mock;

  /**
   * Resets the builder state and clears the `window.matchMedia` mock.
   */
  reset(): void;
}

/**
 * The default implementation of `Builder`.
 */
export class DefaultBuilder implements Builder {
  /**
   * Initializes the new builder.
   *
   * @param result The result to be returned by the mock.
   */
  public constructor(private result: Partial<MediaQueryList> = {}) {}

  /**
   * Sets the addEventListener mock.
   *
   * @return The mock.
   */
  public addEventListener() {
    return (this.result.addEventListener = jest.fn());
  }

  /**
   * Sets the return value using `mockImplementation`.
   */
  public many() {
    mock.mockClear().mockImplementation(() => ({
      ...this.result,
    }));
  }

  /**
   * Sets the value for `matches`.
   *
   * @param matches The value.
   *
   * @return The builder.
   */
  public matches(matches: boolean) {
    this.result = {
      ...this.result,
      matches,
    };

    return this;
  }

  /**
   * Sets the return value using `mockImplementationOnce`.
   */
  public once() {
    mock.mockClear().mockImplementationOnce(() => ({
      ...this.result,
    }));
  }

  /**
   * Sets the removeEventListener mock.
   *
   * @return The mock.
   */
  public removeEventListener() {
    return (this.result.removeEventListener = jest.fn());
  }

  /**
   * Resets the builder and the mock.
   */
  public reset() {
    this.result = {};

    mock.mockClear();
  }
}

/**
 * An "implementation" of the builder where nothing is implemented.
 *
 * This class is only used if Jest is not available.
 */
export class NotImplemented implements Builder {
  addEventListener(): never {
    throw this.error();
  }

  many(): void {
    throw this.error();
  }

  matches(_: boolean): never {
    throw this.error();
  }

  once(): void {
    throw this.error();
  }

  removeEventListener(): never {
    throw this.error();
  }

  reset(): void {
    throw this.error();
  }

  private error(): Error {
    return new Error('Not implemented.');
  }
}

let builder: Builder;
let mock: jest.Mock | jest.SpyInstance;

if (jest) {
  /**
   * The mock `window.matchMedia` object.
   */
  mock = jest.fn();

  // Add it to the window object.
  // @ts-ignore: Detection only valid for browser environment, not Node.
  if (window.matchMedia) {
    mock = jest.spyOn(window, 'matchMedia');
  } else {
    Object.defineProperty(window, 'matchMedia', {
      value: mock,
    });
  }

  builder = new DefaultBuilder();
} else {
  builder = new NotImplemented();
}

export default builder;
