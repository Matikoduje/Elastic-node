import config from 'config';
import app from './app/_app';
import logger from './log/_logger';
import elasticClient from './db/elastic-client';
import { elasticCreateIndex, elasticSetMapping } from './db/elastic-methods';
import capsuleSchema from './models/capsule';

const index: string = config.get('Config.elasticSearch.index');
const port: number = config.get('Config.app.port');
const host: string = config.get('Config.app.host');

async function startServer() {
  try {
    const capsuleIndex = await elasticClient.indices.exists({ index });
    if (!capsuleIndex) {
      await elasticCreateIndex(elasticClient, index);
      await elasticSetMapping(elasticClient, capsuleSchema, index);
    }
  } catch (err) {
    logger.error({ err });
  } finally {
    app.listen(port, () => {
      logger.info(`Server is listening on http://${host}:${port}`);
    });
  }
}

startServer();
