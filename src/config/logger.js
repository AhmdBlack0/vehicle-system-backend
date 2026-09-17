/**
 * Winston Logger Configuration
 * Outputs structured logs to console and rotating log files
 */

const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

const { combine, timestamp, printf, colorize, errors, json } = format;

// Custom console format for readability
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Define transports based on environment
const transportsList = [
  // ── Console ──────────────────────────────────────────────────────────────
  new transports.Console({
    format: combine(colorize(), timestamp({ format: 'HH:mm:ss' }), consoleFormat),
  }),
];

// Only add file transports if not in Vercel (local development)
if (process.env.VERCEL !== '1') {
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // ── Error Log File ────────────────────────────────────────────────────────
  transportsList.push(
    new transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: combine(timestamp(), json()),
    }),
  );

  // ── Combined Log File ─────────────────────────────────────────────────────
  transportsList.push(
    new transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: combine(timestamp(), json()),
    }),
  );
}

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
  ),
  transports: transportsList,
});

module.exports = logger;
