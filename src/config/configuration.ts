export default () => ({
  PORT: process.env.PORT,
  SECRET: process.env.SECRET,
  SSO_URL: process.env.SSO_URL,
  GRANT_TYPE: process.env.GRANT_TYPE,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  SCOPE: process.env.SCOPE,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
});
