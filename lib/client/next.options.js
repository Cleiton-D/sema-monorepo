module.exports = {
  swcMinify: true,

  compiler: {
    styledComponents: true
  },
  // experimental: {
  //   outputStandalone: true
  // },

  typescript: {
    ignoreBuildErrors: true
  },

  eslint: {
    ignoreDuringBuilds: true
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  }
};
