import { ColorScheme, getColorScheme, watchColorScheme } from '../src';

let mockList: jest.Mock<Partial<Window['matchMedia']>>;

beforeAll(() => {
  mockList = jest.fn();

  Object.defineProperty(window, 'matchMedia', {
    value: mockList,
  });
});

beforeEach(() => {
  mockList.mockClear();
});

describe('getColorScheme', () => {
  test('detects when a dark theme is preferred', () => {
    mockList.mockImplementationOnce(() => ({
      matches: true,
    }));

    expect(getColorScheme()).toEqual(ColorScheme.Dark);
  });

  test('detects when a light theme is preferred', () => {
    mockList.mockImplementationOnce(() => ({
      matches: false,
    }));

    expect(getColorScheme()).toEqual(ColorScheme.Light);
  });
});

describe('watchColorScheme', () => {
  test('adds and removes a listener', () => {
    const addEventListener = jest.fn();
    const removeEventListener = jest.fn();
    const watcher = jest.fn();

    mockList.mockImplementationOnce(() => ({
      addEventListener,
      removeEventListener,
    }));

    const callback = watchColorScheme(watcher);

    expect(callback).toBeDefined();
    expect(addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );

    callback();

    expect(removeEventListener).toHaveBeenCalledWith(
      'change',
      addEventListener.mock.calls[0][1]
    );
  });

  test('watcher receives changes', () => {
    const addEventListener = jest.fn();
    const watcher = jest.fn();

    mockList.mockImplementationOnce(() => ({
      addEventListener,
    }));

    watchColorScheme(watcher);

    expect(addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );

    addEventListener.mock.calls[0][1]({
      matches: true,
    });

    expect(watcher).toHaveBeenCalledWith(ColorScheme.Dark);
  });
});
