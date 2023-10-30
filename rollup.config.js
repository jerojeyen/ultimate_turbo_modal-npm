import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/ultimate_turbo_modal.min.js',
    format: 'esm'
  },
  external: [
    // This makes us not inline dependencies.
    /node_modules/
  ],
  inlineDynamicImports: true,
  plugins: [
    resolve(),
    terser()
  ]
};
