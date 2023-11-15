module.exports = {
  basePath: '/legacy',
  async rewrites() {
    return {
      afterFiles: [{ source: '/:path*', destination: '/_404/:path*' }]
    };
  },

  optimizeFonts: true,

  swcMinify: true,

  compiler: {
    styledComponents: true
  },

  typescript: {
    ignoreBuildErrors: true
  },

  eslint: {
    ignoreDuringBuilds: true
  },

  images: {
    domains: [process.env.SERVER_HOSTNAME],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.diarioescolar.net.br',
        port: '',
        pathname: '/files/**'
      }
    ]
  },

  output: 'standalone',

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  }
};
