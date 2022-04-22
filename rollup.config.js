import typescript from "@rollup/plugin-typescript";
import babel from "rollup-plugin-babel";
import sourceMaps from "rollup-plugin-sourcemaps";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from '@rollup/plugin-commonjs';
import json from 'rollup-plugin-json';
import { eslint } from 'rollup-plugin-eslint';

export default {
  input: "./src/index.ts",
  plugins: [
    typescript(),
    resolve(),
    commonjs(),
    json(),
    eslint({
      throwOnError: true,
      throwOnWarning: false,
      include: ['src/**'],
      exclude: ['node_modules/**']
    }),
    sourceMaps(),
    // babel({
    //   exclude:'node_modules/**'
    // })
  ],
  external:['vue'],
  output: [
    {
      format: "es",
      file: "lib/bundle.esm.js",
      sourcemap: true
    }
  ]
};
