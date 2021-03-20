[![Quality Check](https://github.com/kherge/js.prefers-color-scheme/actions/workflows/test.yml/badge.svg)](https://github.com/kherge/js.prefers-color-scheme/actions/workflows/test.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=kherge_js.prefers-color-scheme&metric=alert_status)](https://sonarcloud.io/dashboard?id=kherge_js.prefers-color-scheme)

# prefers-color-scheme

A simple library for programatically consuming the CSS `prefers-color-scheme` media feature.

## Documentation

This is an ES6 browser library written in TypeScript.

```ts
import {
  ColorScheme,
  getColorScheme,
  matchMedia,
  watchColorScheme,
} from '@kherge/prefers-color-scheme';
```

### Recognized Color Schemes

```ts
enum ColorScheme
```

The `ColorScheme` enum has members that are the [officially recognized][] color schemes.

```ts
console.log(ColorScheme.Dark); // 'dark'
console.log(ColorScheme.Light); // 'light'
```

[officially recognized]: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme#syntax

### Retrieving Color Scheme

```ts
const getColorScheme: () => ColorScheme;
```

The `getColorScheme` function retrieves the currently preferred color scheme.

```ts
console.log(getColorScheme()); // 'dark'
```

### Watching for Changes

```ts
const watchColorScheme: (watcher: Watcher) => () => void;

// The watcher provided to watchColorsScheme.
type Watcher = (colorScheme: ColorScheme) => void;
```

The `watchColorScheme` function invokes a callback any time the preferred color
scheme changes.

```ts
const removeWatcher = watchColorScheme(colorScheme => console.log(colorScheme));
```

If we want to stop listening to changes, we use the returned function.

```ts
removeWatcher();
```

### Testing

```ts
interface Builder {
  addEventListener(): jest.Mock;
  many(): void;
  matches(matches: boolean): Builder;
  once(): void;
  removeEventListener(): jest.Mock;
  reset(): void;
}
```

The `matchMedia` utility simplifies the process of using mock implementations for the
`window.matchMedia` method (which is undefined in Node).

```ts
beforeEach(() => matchMedia.reset());

describe('example tests using matchMedia', () => {
  test('mock the return value for matches', () => {
    matchMedia.matches(true).once();

    expect(getColorScheme()).toBe(ColorScheme.Dark);

    matchMedia.matches(false).once();

    expect(getColorScheme()).toBe(ColorScheme.Light);
  });

  test('mock event listener management', () => {
    const addEventListener = matchMedia.addEventListener();
    const removeEventListener = matchMedia.removeEventListener();

    matchMedia.once();

    const listener = jest.fn();

    const remove = watchColorScheme(listener);

    expect(addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );

    remove();

    expect(removeEventListener).toHaveBeenCalled();
  });
});
```

## Installation

    npm install @kherge/prefers-color-scheme

## Requirements

- Browser Support for ES6/ESM

## Development

Created using [TSDX](https://tsdx.io/).

### Building

    npm run build

Builds to the `dist/` folder.

### Linting

    npm run lint

Runs ESLint with Prettier.

### Unit Testing

    npm test

> You can also run `npm run test:watch` to use interactive watch mode.
