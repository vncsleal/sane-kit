type LogLevel = 'debug' | 'info' | 'warn' | 'error'
type LogContext = Record<string, unknown>

function emit(level: LogLevel, message: string, context?: LogContext) {
  const method = level === 'debug' ? 'log' : level
  const line = `[sane-kit] ${message}`
  if (context && Object.keys(context).length > 0) {
    console[method](line, context)
  } else {
    console[method](line)
  }
}

/**
 * Single logging surface for the app. Swap the sink here (Sentry, Axiom, …)
 * instead of scattering `console.*` across components.
 */
export const logger = {
  debug: (message: string, context?: LogContext) => emit('debug', message, context),
  info: (message: string, context?: LogContext) => emit('info', message, context),
  warn: (message: string, context?: LogContext) => emit('warn', message, context),
  error: (message: string, context?: LogContext) => emit('error', message, context),
}
