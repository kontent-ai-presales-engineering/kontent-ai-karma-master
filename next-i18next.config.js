const path = require('path')
module.exports = {
    i18n: {
      defaultLocale: 'en-GB',
      locales: ['en-GB', 'fr-FR', 'es-ES'],
      localeDetection: false,
    },
    localePath:
    typeof window === 'undefined'
      ? require('path').resolve('./public/locales')
      : '/locales',
    react: { useSuspense: false },
  };