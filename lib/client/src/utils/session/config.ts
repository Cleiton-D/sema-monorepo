export const sessionOptions = {
  password: '5a0R8GsYz@!RblV4bRLQ1a1*Xpz^3OTL',
  cookieName: 'sema.3WGc5Lm3l9m',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  ttl: 1200000,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production'
  }
};
