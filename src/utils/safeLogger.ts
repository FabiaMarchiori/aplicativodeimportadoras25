
// Production-safe logging utility that sanitizes sensitive data

interface LogLevel {
  DEBUG: 'debug';
  INFO: 'info';
  WARN: 'warn';
  ERROR: 'error';
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

// Sensitive data patterns to sanitize
const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /key/i,
  /auth/i,
  /email/i,
  /phone/i
];

const sanitizeData = (data: any): any => {
  if (typeof data === 'string') {
    return data.replace(/(.{2}).*(@.*)/, '$1***$2'); // Basic email masking
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      const isSensitive = SENSITIVE_PATTERNS.some(pattern => pattern.test(key));
      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitizeData(value);
      }
    }
    return sanitized;
  }
  
  return data;
};

export const safeLog = {
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DEBUG] ${message}`, data ? sanitizeData(data) : '');
    }
  },
  
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[INFO] ${message}`, data ? sanitizeData(data) : '');
    }
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data ? sanitizeData(data) : '');
  },
  
  error: (message: string, error?: any) => {
    const sanitizedError = error instanceof Error 
      ? { message: error.message, name: error.name }
      : sanitizeData(error);
    console.error(`[ERROR] ${message}`, sanitizedError);
  }
};

// Replace console.log calls gradually
export const secureConsole = {
  log: safeLog.info,
  info: safeLog.info,
  warn: safeLog.warn,
  error: safeLog.error,
  debug: safeLog.debug
};
