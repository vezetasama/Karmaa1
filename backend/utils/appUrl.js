/**
 * Public base URL for redirects and payment callbacks.
 * Render/Railway set CLIENT_URL; local dev falls back to localhost.
 */
const getClientUrl = () => {
  const url = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  return url;
};

const getApiBaseUrl = () => {
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL.replace(/\/$/, '');
  }
  const client = getClientUrl();
  if (process.env.NODE_ENV === 'production' && !client.includes('localhost')) {
    return client;
  }
  const port = process.env.PORT || 5000;
  return `http://localhost:${port}`;
};

const getAllowedOrigins = () => {
  const origins = new Set();
  const client = getClientUrl();
  origins.add(client);
  if (process.env.NODE_ENV !== 'production') {
    [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:4173',
      'http://127.0.0.1:4173',
      'http://localhost:5000',
      'http://127.0.0.1:5000',
    ].forEach((o) => origins.add(o));
  }
  return [...origins];
};

module.exports = { getClientUrl, getApiBaseUrl, getAllowedOrigins };
