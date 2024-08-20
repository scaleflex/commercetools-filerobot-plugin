import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptions}
 */
const config = {
  name: 'Scaleflex DAM',
  entryPointUriPath,
  cloudIdentifier: 'gcp-eu',
  env: {
    development: {
      initialProjectKey: 'project-key',
    },
    production: {
      applicationId: 'TODO',
      url: 'https://your_app_hostname.com',
    },
  },
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Scaleflex DAM',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      uriPath: 'products',
      defaultLabel: 'Products',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
  ],
  headers: {
    csp: {
      "connect-src": ["https://*.ultrafast.io", "https://*.filerobot.com", "https://your_app_hostname.com"],
      "frame-src": ["https://js.stripe.com", "https://hooks.stripe.com", "https://*.filerobot.com","https://your_app_hostname.com"],
      "script-src": ["https://js.stripe.com", "https://*.filerobot.com","https://your_app_hostname.com"]
    }
  }
};

export default config;
