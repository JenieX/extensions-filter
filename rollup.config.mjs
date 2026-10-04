// import terser from '@rollup/plugin-terser';

/** @type {import('rollup').RollupOptions} */
const config = {
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',

    format: 'esm',
    // format: 'iife',
    // compact: true,
  },
  treeshake: {
    propertyReadSideEffects: false,
    unknownGlobalSideEffects: false,
  },

  // plugins: [
  //   terser({
  //     format: {
  //       comments: false,
  //     },
  //   }),
  // ],
};

export default config;
