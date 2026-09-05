export const logger = {
  info: (msg, ...args) => console.log(`[PAYMATE INFO] ${new Date().toISOString()} - ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`[PAYMATE WARN] ${new Date().toISOString()} - ${msg}`, ...args),
  error: (msg, ...args) => console.error(`[PAYMATE ERROR] ${new Date().toISOString()} - ${msg}`, ...args),
  agent: (msg, ...args) => console.log(`[PAYMATE AGENT] 🤖 ${new Date().toISOString()} - ${msg}`, ...args)
};
