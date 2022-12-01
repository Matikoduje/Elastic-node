import nodeSchedule from 'node-schedule';
import config from 'config';
import logger from '../log/_logger';
import elasticEtag from '../models/elasticTag';
import { syncRequest } from '../sync/sync-request';
import { StatusCodeError } from '../handlers/error-handler';

// For DEV environment interval is set for running task for every one minute, in PROD every one hour.
const jobInterval: string = config.get('Config.app.syncInterval');
const jobName: string = 'synchronizeJob';

async function synchronizeCapsules() {
  logger.info('Start CRON job - Synchronize capsules.');
  try {
    const etag = await elasticEtag.getCurrentEtag();
    const { data } = await syncRequest(etag);
    console.log(data);
  } catch (err: any) {
    const statusCode = err instanceof StatusCodeError ? err.statusCode : 500;
    const errorMessage =
      err instanceof StatusCodeError ? err.message : 'Unexpected Error.';
    logger.error(`${errorMessage} with status code ${statusCode}`);
  } finally {
    logger.info('End CRON job - Synchronize capsules');
  }
}

export const syncJob: nodeSchedule.Job = nodeSchedule.scheduleJob(
  jobName,
  jobInterval,
  synchronizeCapsules
);
