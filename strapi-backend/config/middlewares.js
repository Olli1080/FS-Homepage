module.exports = ({env}) => [
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:', 'http:'],
          'img-src': ["'self'", 'data:', 'blob:', env('S3_ENDPOINT')],
          'media-src': ["'self'", 'data:', 'blob:', env('S3_ENDPOINT')],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
];