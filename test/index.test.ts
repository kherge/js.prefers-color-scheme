import {
  ColorScheme,
  getColorScheme,
  matchMedia,
  watchColorScheme,
} from '../src';

beforeEach(() => matchMedia.reset());

describe('getColorScheme', () => {
  test('detects when a dark theme is preferred', () => {
    matchMedia.matches(true).once();

    expect(getColorScheme()).toEqual(ColorScheme.Dark);
  });

  test('detects when a light theme is preferred', () => {
    matchMedia.matches(false).once();

    expect(getColorScheme()).toEqual(ColorScheme.Light);
  });
});

describe('watchColorScheme', () => {
  test('adds and removes a listener', () => {
    const addEventListener = matchMedia.addEventListener();
    const removeEventListener = matchMedia.removeEventListener();
    const watcher = jest.fn();

    matchMedia.once();

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
    const addEventListener = matchMedia.addEventListener();
    const watcher = jest.fn();

    matchMedia.once();

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
