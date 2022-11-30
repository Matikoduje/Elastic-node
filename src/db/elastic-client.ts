import { Client, ClientOptions } from '@elastic/elasticsearch';
import config from 'config';

const elasticUrl: string = config.get('Config.elasticSearch.URL');
const username: string = config.get('Config.elasticSearch.username');
const password: string = config.get('Config.elasticSearch.password');

const elasticClientOptions: ClientOptions = {
  node: elasticUrl,
  auth: {
    username,
    password
  }
};

const elasticClient = new Client(elasticClientOptions);

export default elasticClient;
