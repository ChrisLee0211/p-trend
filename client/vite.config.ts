import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), resolve(),
    commonjs(),]
});
