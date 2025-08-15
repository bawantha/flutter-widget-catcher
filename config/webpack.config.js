'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = merge(common, {
  entry: {
    snackbar:PATHS.src+'/snackbar.css',
    contentScript: PATHS.src + '/contentScript.js',
    background: PATHS.src + '/background.js',
    popup: PATHS.src + '/popup.js',
  },
});

module.exports = config;
