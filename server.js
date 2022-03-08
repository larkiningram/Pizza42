const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const { join } = require('path');
const authConfig = require('./auth_config.json');

const app = express();

const config = {
  domain: process.env.DOMAIN || authConfig.domain,
  clientId: process.env.CLIENT_ID || authConfig.clientId,
  customAudience: process.env.CUSTOM_AUDIENCE || authConfig.customAudience,
  mgmtAudience: process.env.MGMT_AUDIENCE || authConfig.mgmtAudience,
  appUrl: process.env.APP_URL || authConfig.appUrl,
  apiUri: process.env.API_URI || authConfig.apiUri,
  scope: process.env.SCOPE || authConfig.scope,
  userMetaData: process.env.USER_METADATA || authConfig.userMetaData,
};

module.exports = { config };

const port = process.env.PORT || 4200;

app.use(morgan('dev'));

app.use(
  helmet({
    contentSecurityPolicy: {
      // reportOnly: true,
      directives: {
        'default-src': ["'self'"],
        'connect-src': ["'self'", 'https://*.auth0.com', authConfig.apiUri],
        'frame-src': ["'self'", 'https://*.auth0.com'],
        'base-uri': ["'self'"],
        'block-all-mixed-content': [],
        'font-src': ["'self'", 'https:', 'data:'],
        'frame-ancestors': ["'self'"],
        'img-src': ["'self'", 'data:', '*.gravatar.com'],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
      },
    },
  })
);

app.use(express.static(join(__dirname, 'dist')));

app.listen(port, () => console.log(`App server listening on port ${port}`));
