const path = require('path');
const ROOT = __dirname;

/** wepback resolve */
const RESOLVE = {
  extensions: ['.ts'],
};

/** webpack plugins */
const PLUGINS = [];
const MODULE = {
  rules: [
    // Scripts
    {
      test: /\.ts$/,
      exclude: [/node_modules/],
      loader: 'awesome-typescript-loader',
      options: {
        useBabel: true,
        babelCore: '@babel/core',
      },
      include: [ROOT],
    },
  ],
};
const OUTPUT = {
  filename: 'showGitVersion.js',
  libraryTarget: 'umd',
  library: 'ShowGitVersion',
};

module.exports = {
  node: {
    fs: 'empty',
  },
  entry: {
    app: `${ROOT}/src/index.ts`,
  },
  context: ROOT,
  resolve: RESOLVE,
  mode: 'production',
  module: MODULE,
  plugins: PLUGINS,
  devtool: 'source-map',
  devServer: {},
  output: OUTPUT,
};
