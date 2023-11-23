import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/code.ts'],
  format: ['iife'],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: false,
  minify: true,
  outExtension: () => ({
    js: `.js`
  })
});
