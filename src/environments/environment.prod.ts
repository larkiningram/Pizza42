import config from "../../auth_config.json";

const { domain, clientId, customAudience, mgmtAudience, apiUri, appUri, errorPath, scope, userMetaData} = config as {
  domain?: string;
  clientId?: string;
  customAudience?: string;
  mgmtAudience?: string;
  apiUri?: string;
  appUri?: string;
  errorPath?: string;
  scope?: string;
  userMetaData?: string;
};

export const environment = {
  production: true,
  auth: {
    domain,
    clientId,
    customAudience,
    mgmtAudience,
    redirectUri: window.location.origin,
    appUri,
    errorPath,
    scope,
    userMetaData
  },
  httpInterceptor: {
    allowedList: [`${apiUri}/*`],
  },
};
