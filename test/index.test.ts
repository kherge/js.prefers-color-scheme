import {
  ColorScheme,
  getColorScheme,
  matchMedia,
  watchColorScheme,
} from '../src';

beforeEach(() => matchMedia.reset());

describe('getColorScheme', () => {
  test('detects when a dark theme is preferred', () => {
    matchMedia.once(spec => {
      spec.matches(true);
    });

    expect(getColorScheme()).toEqual(ColorScheme.Dark);
  });

  test('detects when a light theme is preferred', () => {
    matchMedia.once(spec => {
      spec.matches(false);
    });

    expect(getColorScheme()).toEqual(ColorScheme.Light);
  });
});

describe('watchColorScheme', () => {
  test('adds and removes a listener', () => {
    const watcher = jest.fn();
    const { addEventListener, removeEventListener } = matchMedia.once(spec => {
      spec.addEventListener();
      spec.removeEventListener();
    });

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
    const watcher = jest.fn();
    const { addEventListener } = matchMedia.once(spec => {
      spec.addEventListener();
    });

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
