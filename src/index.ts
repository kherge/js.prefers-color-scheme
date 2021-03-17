/**
 * The recognized color schemes.
 */
export enum ColorScheme {
  /**
   * Dark theme.
   */
  Dark = 'dark',

  /**
   * Light theme.
   */
  Light = 'light',
}

/**
 * Queries the CSS media to check if a dark theme is preferred.
 *
 * @return The media query list.
 */
const query = () => window.matchMedia('(prefers-color-scheme: dark)');

/**
 * Returns the currently preferred color scheme.
 *
 * @return The color scheme.
 */
export const getColorScheme = () =>
  query().matches ? ColorScheme.Dark : ColorScheme.Light;

/**
 * Defines a function that accepts a color scheme as an argument.
 */
export type Watcher = (colorScheme: ColorScheme) => void;

/**
 * Watches the color scheme for changes.
 *
 * @param watcher A listener that will observe for changes.
 *
 * @return A callback to remove the listener.
 */
export const watchColorScheme = (watcher: Watcher) => {
  const listener = (event: MediaQueryListEvent) =>
    watcher(event.matches ? ColorScheme.Dark : ColorScheme.Light);

  const media = query();

  media.addEventListener('change', listener);

  return () => media.removeEventListener('change', listener);
};
