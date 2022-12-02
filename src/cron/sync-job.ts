import nodeSchedule from 'node-schedule';
import config from 'config';
import logger from '../log/_logger';
import elasticEtag from '../models/elasticTag';
import { syncRequest } from '../sync/sync-request';
import elasticCapsule, { capsuleDocument } from '../models/elasticCapsule';

const jobInterval: string = config.get('Config.app.syncInterval');

async function synchronizeCapsules() {
  logger.info('------ START SYNCHRONIZE CAPSULES JOB ------');
  try {
    const etag = await elasticEtag.getCurrentEtag();
    const response = await syncRequest(etag);
    if (response.status !== 304) {
      const newEtag = response.data.etag;
      const capsules = response.data.capsules as capsuleDocument[];
      const { successful, failed } = await elasticCapsule.syncCapsules(
        capsules
      );
      logger.info(`During job was synchronized ${successful} capsules.`);
      if (failed > 0) {
        logger.error(`During synchronization ${failed} errors occurred.`);
      }
      await elasticEtag.addEtag(newEtag);
    } else {
      logger.info('The data does not require synchronization');
    }
  } catch (err: any) {
    logger.error({ err });
  } finally {
    logger.info('------ END SYNCHRONIZE CAPSULES JOB ------');
  }
}

const syncCapsulesJob: nodeSchedule.Job = nodeSchedule.scheduleJob(
  jobInterval,
  synchronizeCapsules
);

export default syncCapsulesJob;
