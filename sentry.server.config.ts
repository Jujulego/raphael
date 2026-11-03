// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://7f1abcbd430aece1872a74540fee435e@o4508229080055808.ingest.de.sentry.io/4510646017785936',
  enabled: process.env.NODE_ENV === 'production',

  // Add optional integrations for additional features
  integrations: [],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Sentry v11's default dataCollection preserves the previous sendDefaultPii: true behavior.
});
