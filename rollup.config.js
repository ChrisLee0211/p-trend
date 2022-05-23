import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default  {
    input: './src/index.ts',
    external: ['@swc/core'],
    output: {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs.js',
    },
    plugins: [resolve(), commonjs(),json(), typescript({module:'ESNext'})],
  };