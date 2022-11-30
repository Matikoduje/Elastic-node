import bunyan, { LogLevel } from 'bunyan';
import config from 'config';

const logLevel: LogLevel = config.get('Config.app.logLevel');

const logger: bunyan = bunyan.createLogger({
  name: 'elastic-app',
  stream: process.stdout,
  level: logLevel,
  serializers: { err: bunyan.stdSerializers.err }
});

export default logger;
