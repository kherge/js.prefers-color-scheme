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
import { matchMedia } from '@kherge/prefers-color-scheme';

interface Builder {
  once(specifier: Specifier): Implementation;
  many(specifier: Specifier): Implementation;
  reset(): Builder;
}

export interface Specification {
  addEventListener(mock?: jest.Mock): void;
  matches(state: boolean): void;
  removeEventListener(mock?: jest.Mock): void;
}
```

The `matchMedia` utility is an instance of `Builder` which simplifies the process of defining
the mock implementation for `window.matchMedia`.

```ts
beforeEach(() => matchMedia.reset());

describe('example tests using matchMedia', () => {
  test('mock the return value for matches', () => {
    matchMedia.once(spec => {
      spec.matches(true);
    });

    expect(getColorScheme()).toBe(ColorScheme.Dark);

    matchMedia.once();

    expect(getColorScheme()).toBe(ColorScheme.Light);
  });

  test('mock event listener management', () => {
    const { addEventListener, removeEventListener } = matchMedia.once();

    const listener = jest.fn();
    const remove = watchColorScheme(listener);

    expect(addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );

    remove();

    expect(removeEventListener).toHaveBeenCalled();
  });

  test('mock event listener management (again)', () => {
    const addEventListener = jest.fn();
    const removeEventListener = jest.fn();

    matchMedia.once(spec => {
      spec.addEventListener(addEventListener);
      spec.removeEventListener(removeEventListener);
    });

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
