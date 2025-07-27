declare module 'vite-plugin-eslint' {
  import { Plugin } from 'vite';
  interface Options {
    fix?: boolean;
  }
  const eslintPlugin: (options?: Options) => Plugin;
  export default eslintPlugin;
}