export const logger = {
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[DEBUG]', ...args)
    }
  },
  info: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.info('[INFO]', ...args)
    }
  },
  warn: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[WARN]', ...args)
    }
  },
  error: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.error('[ERROR]', ...args)
    }
  }
}
