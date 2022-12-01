import config from 'config';
import app from './app/_app';
import logger from './log/_logger';
import { syncJob } from './cron/sync-job';
import { prepareMappingForIndex } from './db/elastic-methods';
import elasticCapsule from './models/elasticCapsule';
import elasticEtag from './models/elasticTag';

const port: number = config.get('Config.app.port');
const host: string = config.get('Config.app.host');

async function startServer() {
  try {
    await prepareMappingForIndex(
      elasticCapsule.getIndex(),
      elasticCapsule.getSchema()
    );
    await prepareMappingForIndex(
      elasticEtag.getIndex(),
      elasticEtag.getSchema()
    );
  } catch (err) {
    logger.error({ err });
  } finally {
    syncJob;
    app.listen(port, () => {
      logger.info(`Server is listening on http://${host}:${port}`);
    });
  }
}

startServer();
