# Pizza 42 - Auth0

This is a POC illustrating how one would integrate Auth0 into a pizza ordering app to solve a string of client challenges.

- offloading credential management
- frictionless/customizable login experience
- enriched customer data on login

Deployed at https://larkins-pizza-42.herokuapp.com/

# Auth0 Angular SDK sample

This sample app demonstrates the integration of the [Auth0 Angular SDK](https://github.com/auth0/auth0-angular) into an Angular application created using the Angular CLI. This sample is a companion to the [Auth0 Angular SDK Quickstart](https://auth0.com/docs/quickstart/spa/angular).

This sample demonstrates the following use cases:

- Login
- Log out
- Showing the user profile
- Protecting routes using the authentication guard
- Calling APIs with automatically-attached bearer tokens

## Configuration

The sample needs to be configured with your Auth0 domain and client ID in order to work. In the root of the sample, copy `auth_config.json.example` and rename it to `auth_config.json`. Open the file and replace the values with those from your Auth0 tenant:

```json
{
  "domain": "<YOUR AUTH0 DOMAIN>",
  "clientId": "<YOUR AUTH0 CLIENT ID>",
  "audience": "<YOUR AUTH0 API AUDIENCE IDENTIFIER>"
}
```

## Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

This will automatically start a Node + Express server as the backend on port `3001`. The Angular application is configured to proxy through to this on any `/api` route.

## Build

Run `npm build` to build the project. The build artifacts will be stored in the `dist/login-demo` directory. Use the `--prod` flag for a production build.

To build and run a production bundle and serve it, run `npm run prod`. The application will run on `http://localhost:3000`.
