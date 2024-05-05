const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer({
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  webpack: (config) => {
    config.resolve.fallback = {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      fs: false,
      tls: false,
      net: false,
      path: false,
      zlib: false,
      os: false,
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer')
    };

    return config;
  }
});
