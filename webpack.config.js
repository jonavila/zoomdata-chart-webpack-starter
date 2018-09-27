const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'dist'),
};

const commonConfig = merge([
  {
    output: {
      path: PATHS.build,
      filename: 'visualization.js',
    },
  },
  parts.loadJavaScript({ include: PATHS.app }),
  parts.loadCSS({
    use: ['style-loader', 'css-loader', parts.autoprefix(), 'sass-loader'],
  }),
  parts.copyFilesToBuildDir(),
]);

const productionConfig = merge([
  {
    performance: {
      hints: 'warning', // 'error' or false are valid too
      maxEntrypointSize: 100000, // in bytes
      maxAssetSize: 450000, // in bytes
    },
    output: {
      chunkFilename: 'visualization.js',
      filename: 'visualization.js',
    },
  },
  parts.clean(PATHS.build),
  parts.minifyJavaScript(),
  parts.minifyCSS({
    options: {
      discardComments: {
        removeAll: true,
      },
      // Run cssnano in safe mode to avoid
      // potentially unsafe transformations.
      parser: require('postcss-safe-parser'),
    },
  }),
]);

const developmentConfig = merge([
  {
    watch: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/,
    },
  },
]);

module.exports = mode => {
  const pages = [
    parts.page({
      entry: {
        app: PATHS.app + '/--chartname--',
      },
    }),
  ];
  const config = mode === 'production' ? productionConfig : developmentConfig;

  return merge([commonConfig, config, { mode }].concat(pages));
};
