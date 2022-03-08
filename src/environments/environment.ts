import config from "../../server";

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
  production: false,
  auth: {
    domain,
    clientId,
    customAudience,// ...(customAudience && customAudience !== 'YOUR_API_IDENTIFIER' ? { customAudience } : null),
    mgmtAudience, // ...(mgmtAudience && mgmtAudience !== 'YOUR_API_IDENTIFIER' ? { mgmtAudience } : null ),
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
