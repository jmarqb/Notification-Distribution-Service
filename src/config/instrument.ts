import * as Sentry from '@sentry/nestjs';
import { envs } from './envs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: envs.sentry_dsn,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});