import { defineConfig } from 'tsdown';
import babel from '@rollup/plugin-babel';

export default defineConfig({
  entry: ['src/code.ts'],
  format: ['iife'],
  sourcemap: false,
  clean: true,
  dts: false,
  minify: true,
  target: 'node12',
  noExternal: ['transform-to-tailwindcss-core', 'transform-to-unocss-core'],
  plugins: [
    babel({
      babelHelpers: 'bundled',
    }) as any
  ]
});
