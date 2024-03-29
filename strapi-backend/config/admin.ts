export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '458d6a0562887d702742619e02346abb'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT')
  },
  port: 7000,
  host: 'localhost',
  url: env('URL_ADMIN', 'http://127.0.0.1:7000/admin'),
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT')
    }
  }
});
