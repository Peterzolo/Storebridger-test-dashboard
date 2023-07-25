import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, label, printf, colorize } = format;

import config from '../../config';

const myFormat = printf((info) => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logLevel = config.logs.level === 'development' ? 'debug' : 'warn';

const options = {
  file: {
    level: logLevel,
    filename: `${config.logs.directory}/%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    timestamp: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    prettyPrint: true,
    json: true,
    maxSize: '20m',
    colorize: true,
    maxFiles: '14d',
  },
};

const logger = createLogger({
  format: combine(label({ label: config.appName }), timestamp(), myFormat),
  transports: [
    /**
     * - Write to all logs with level `info` and below to `combined.log`
     */
    new transports.File({
      filename: `${config.logs.directory}/combined.log`,
    }),
  ],
  exceptionHandlers: [new DailyRotateFile(options.file)],
  exitOnError: false, // do not exit on handled exceptions
});
/**
 *
 * If we're not in production then log to the `console` with the format:
 * `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
 */

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: combine(label({ label: config.appName }), colorize(), timestamp(), myFormat),
    }),
  );
}

export default logger;
