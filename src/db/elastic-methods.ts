import { Client } from '@elastic/elasticsearch';
import elasticClient from './elastic-client';
import logger from '../log/_logger';

const elasticCreateIndex = async (client: Client, index: string) => {
  try {
    await client.indices.create({ index });
    logger.info(`Successfully created ${index} index.`);
  } catch (err) {
    logger.error(`An error occurred during create index ${index}:`);
    logger.error(err);
  }
};

const elasticSetMapping = async (
  client: Client,
  schema: object,
  index: string
) => {
  const mappingOptions = {
    index,
    body: {
      properties: schema
    }
  };
  try {
    await client.indices.putMapping(mappingOptions);
    logger.info(`Successfully created mapping for ${index}.`);
  } catch (err) {
    logger.error(`An error occurred while mapping is created for ${index}:`);
    logger.error(err);
  }
};

export const prepareMappingForIndex = async (index: string, schema: object) => {
  const isIndexExists = await elasticClient.indices.exists({
    index
  });
  if (!isIndexExists) {
    await elasticCreateIndex(elasticClient, index);
    await elasticSetMapping(elasticClient, schema, index);
  }
};
