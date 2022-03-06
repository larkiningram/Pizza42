import config from '../../auth_config.json';

const { domain, clientId, audience, apiUri, errorPath, scope } = config as {
  domain: string;
  clientId: string;
  audience?: string;
  apiUri: string;
  errorPath: string;
  scope: string;
};

export const environment = {
  production: true,
  auth: {
    domain,
    clientId,
    ...(audience && audience !== "YOUR_API_IDENTIFIER" ? { audience } : null),
    redirectUri: window.location.origin,
    errorPath,
    scope,
  },
  httpInterceptor: {
    allowedList: [`${apiUri}/*`],
  },
};
