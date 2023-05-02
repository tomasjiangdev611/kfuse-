import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';
import { setConfig } from 'react-hot-loader';
import React from 'react';
import { render } from 'react-dom';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import RootWithContexts from './RootWithContexts';
import '../styles/index.scss';

declare const LAUNCH_DARKLY_CLIENT_ID: string;

Sentry.init({
  dsn: 'https://4b72d6579f354d95a526bd662e7bb68f@o1287559.ingest.sentry.io/6502653',
  integrations: [new BrowserTracing()],
  environment: location.hostname,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

setConfig({
  reloadHooks: false,
});

(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: LAUNCH_DARKLY_CLIENT_ID,
    context: {
      anonymous: true,
      kind: 'user',
      hostname: window.location.hostname,
    },
    options: {
      /* ... */
    },
  });

  render(
    <LDProvider>
      <RootWithContexts />
    </LDProvider>,
    document.getElementById('root'),
  );
})();
