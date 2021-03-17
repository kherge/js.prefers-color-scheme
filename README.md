# prefers-color-scheme

A simple library for programatically consuming the CSS `prefers-color-scheme` media feature.

```ts
import {
  ColorScheme,
  getColorScheme,
  watchColorScheme,
} from '@kherge/prefers-color-scheme';

// The recognized color schemes.
console.log(ColorScheme.Dark); // 'dark'
console.log(ColorScheme.Light); // 'light'

// Get the currently preferred color scheme.
console.log(getColorScheme()); // 'dark'

// Watch for changes to preferred color scheme.
watchColorScheme(colorScheme => console.log(colorScheme));
```

## Installation

    npm install @kherge/prefers-color-scheme

## Requirements

- ESM Compatible Browser

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
