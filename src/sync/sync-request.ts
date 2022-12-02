import axios, { AxiosRequestConfig } from 'axios';
import config from 'config';

const requestUrl: string = config.get('Config.request.URL');

export const syncRequest = async (etag: string) => {
  let requestConfig: AxiosRequestConfig = {};

  requestConfig.headers = {
    'if-none-match': etag
  };

  requestConfig.validateStatus = (status: number) => {
    return (status >= 200 && status < 300) || status == 304;
  };

  try {
    return await axios.get(requestUrl, requestConfig);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.message);
    } else {
      throw err;
    }
  }
};
