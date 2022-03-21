const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});
// const withTM = require('next-transpile-modules')(['uuid', 'lodash-es']);

const config = require("./next.options");
module.exports = config;
