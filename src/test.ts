/**
 * The implementation of the specification.
 */
type Implementation = {
  /**
   * The mock to be used for `addEventListener`.
   */
  addEventListener: jest.Mock;

  /**
   * The value to be returned on match.
   */
  matches: boolean;

  /**
   * The mock to be used for `removeEventListener`.
   */
  removeEventListener: jest.Mock;
};

/**
 * A function that accepts a mock specification and builds on it.
 */
type Specifier = (spec: Specification) => void;

/**
 * Defines how the mock `window.matchMedia` builder.
 */
export interface Builder {
  /**
   * Specifies the mock implementation for a single invocation.
   *
   * @param specifier The mock specifier.
   *
   * @return The implementation of the specification.
   */
  once(specifier?: Specifier): Implementation;

  /**
   * Specifies the mock implementation for all invocations.
   *
   * @param specifier The mock specifier.
   *
   * @return The implementation of the specification.
   */
  many(specifier?: Specifier): Implementation;

  /**
   * Clears the mock.
   *
   * @return The builder for method chaining.
   */
  reset(): Builder;
}

/**
 * The default implementation for `Builder`.
 */
class BuilderImpl implements Builder {
  once(specifier: Specifier): Implementation {
    const impl = this.build(specifier);

    matchMock.mockImplementationOnce(() => impl);

    return impl;
  }

  many(specifier: Specifier): Implementation {
    const impl = this.build(specifier);

    matchMock.mockImplementation(() => impl);

    return impl;
  }

  reset() {
    matchMock.mockClear();

    return this;
  }

  private build(specifier?: Specifier): Implementation {
    const spec = new SpecificationImpl();

    if (specifier) {
      specifier(spec);
    }

    return spec.getImplementation();
  }
}

/**
 * The "not implemented" implementation for `Builder`.
 */
class NotImplemented implements Builder {
  once(_: Specifier): never {
    throw this.createError('once');
  }

  many(_: Specifier): never {
    throw this.createError('many');
  }

  reset(): never {
    throw this.createError('reset');
  }

  private createError(method: string): Error {
    return new Error(`Not implemented: ${method}`);
  }
}

/**
 * Defines how the `window.matchMedia` mock will be implemented.
 */
export interface Specification {
  /**
   * Sets or generates the mock to be used for `addEventListener`.
   *
   * @param mock The mock.
   */
  addEventListener(mock: jest.Mock): void;

  /**
   * Sets the value for the `matches` field in the query result.
   *
   * @param state The value.
   */
  matches(state: boolean): void;

  /**
   * Sets or generates the mock to be used for `removeEventListener`.
   *
   * @param mock The mock.
   */
  removeEventListener(mock: jest.Mock): void;
}

/**
 * Defines how the implementation of a specification is retrieved.
 */
interface WithImplementation {
  /**
   * Returns the implementation of the specification.
   */
  getImplementation(): Implementation;
}

/**
 * The default implementation for `Specification`.
 */
class SpecificationImpl implements Specification, WithImplementation {
  /**
   * The implementation details.
   */
  private implementation: Partial<Implementation> = {};

  addEventListener(mock: jest.Mock) {
    this.implementation.addEventListener = mock;
  }

  getImplementation() {
    if (!this.implementation.addEventListener) {
      this.implementation.addEventListener = jest.fn();
    }

    if (!this.implementation.matches) {
      this.implementation.matches = false;
    }

    if (!this.implementation.removeEventListener) {
      this.implementation.removeEventListener = jest.fn();
    }

    return this.implementation as Implementation;
  }

  matches(state: boolean) {
    this.implementation.matches = state;
  }

  removeEventListener(mock: jest.Mock) {
    this.implementation.removeEventListener = mock;
  }
}

let builder: Builder;
let matchMock: jest.Mock | jest.SpyInstance;

if (typeof jest !== 'undefined') {
  /**
   * The mock `window.matchMedia` object.
   */
  matchMock = jest.fn();

  // Add it to the window object.
  // @ts-ignore: Detection only valid for browser environment, not Node.
  if (window.matchMedia) {
    matchMock = jest.spyOn(window, 'matchMedia');
  } else {
    Object.defineProperty(window, 'matchMedia', {
      value: matchMock,
    });
  }

  builder = new BuilderImpl();
} else {
  builder = new NotImplemented();
}

export default builder;
