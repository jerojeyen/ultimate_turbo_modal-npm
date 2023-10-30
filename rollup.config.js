import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/ultimate_turbo_modal.min.js',
    format: 'esm'
  },
  inlineDynamicImports: true,
  plugins: [
    resolve(),
    terser()
  ]
};
