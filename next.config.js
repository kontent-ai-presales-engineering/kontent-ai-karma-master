const { i18n } = require('./next-i18next.config');

module.exports = {
  async redirects() {
    return [
      {
        source: '/articles/category/:category/page/([0-1])',
        destination: '/articles/category/:category',
        permanent: true,
      }
    ]
  },
  async rewrites() {
    return [
        {
            source: '/robots.txt',
            destination: '/api/robots'
        }
    ];
  },
  i18n,
  images: {
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  }
}
