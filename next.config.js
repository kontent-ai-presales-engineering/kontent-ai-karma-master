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
  },
  "functions": {
    "api/create-environment.ts": {
      "memory": 3008,
      "maxDuration": 300 // This function can run for a maximum of 300 seconds
    }
  }
}
