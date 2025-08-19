import cronParser from 'cron-parser';
import { envs } from '../../config';

export function validateCron(cron: string) {
  try {
    cronParser.parse(cron);
    return cron;
  } catch (error) {
    throw new Error(`Invalid cron expression in .env: "${cron}"`);
  }
}

export const CRON_SCHEDULE = validateCron(envs.cron_schedule);