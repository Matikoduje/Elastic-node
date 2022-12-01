import axios, { AxiosRequestConfig } from 'axios';
import config from 'config';
import { StatusCodeError } from '../handlers/error-handler';

const requestUrl: string = config.get('Config.request.URL');

export const syncRequest = async (etag: string) => {
  let requestConfig: AxiosRequestConfig = {};

  requestConfig.headers = {
    'if-none-match': etag
  };

  try {
    return await axios.get(requestUrl, requestConfig);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      let statusCode = err.response?.status;
      if (statusCode === undefined) {
        statusCode = 500;
      }
      throw new StatusCodeError(err.message, statusCode);
    } else {
      throw new StatusCodeError('Unexpected error.', 500);
    }
  }
};
