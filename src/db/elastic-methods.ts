import { Client } from '@elastic/elasticsearch';
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
    type: index,
    include_type_name: true,
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

export { elasticCreateIndex, elasticSetMapping };
