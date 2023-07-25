import dotenv from 'dotenv';

const envFound = dotenv.config({ path: '.env' });

if (!envFound) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const config = {
  appName: process.env.APP_NAME,
  appHost: process.env.APP_HOST,
  port: Number(process.env.PORT),
  dbURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  tokenType: process.env.JWT_TOKEN_TYPE,
  tokenExpiryInHour: Number(process.env.TOKEN_EXPIRY_TIME_IN_HOUR || 1),
  tokenExpiryInMinutes: Number(process.env.TOKEN_EXPIRY_TIME_IN_MINUTE || 15),
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
    directory: process.env.LOG_DIRECTORY,
  },
  api: {
    base: process.env.API_BASE,
    prefix: process.env.API_PREFIX,
  },
  zoom: {
    appSecret: process.env.ZOOM_APP_SECRECT,
    appID: process.env.ZOOM_APP_ID,
    oauthSecret: process.env.ZOOM_OAUTH_SECRECT,
    oauthID: process.env.ZOOM_OAUTH_ID,
    apiBase: process.env.ZOOM_API_BASE,
    verificationToken: process.env.ZOOM_VERIFICATION_TOKEN,
  },
  frontend: {
    base: process.env.FRONTEND_BASE,
    oauthRedirect: process.env.FRONTEND_OAUTH_REDIRECT,
  },
  aws: {
    accessId: process.env.AWS_ACCESS_ID,
    accessSecret: process.env.AWS_ACCESS_SECRET,
    region: process.env.AWS_REGION,
    signature: process.env.AWS_SIGNATURE_V,
    iconBucketUrl: process.env.AWS_ICON_BUCKET_URL,
  },
  sendgrid: {
    apiKey: String(process.env.SENDGRID_API_KEY),
  },
  sendChamp: {
    baseUrl: String(process.env.SENDCHAMP_BASE_URL),
    apiKey: String(process.env.SENDCHAMP_API_KEY),
    senderName: String(process.env.SENDCHAMP_SENDER_NAME),
    smsRoute: String(process.env.SENDCHAMP_ROUTE),
  },
  tokenInfo: {
    accessTokenValidityDays: Number(process.env.ACCESS_TOKEN_VALIDITY_DAYS),
    refreshTokenValidityDays: Number(process.env.REFRESH_TOKEN_VALIDITY_DAYS),
    issuer: process.env.TOKEN_ISSUER || '',
    audience: process.env.TOKEN_AUDIENCE || '',
  },
  rabbitMQ: {
    host: String(process.env.RABBITMQ_HOST),
    closeConnectionTimeout: Number(process.env.CLOSE_CONNECTION_TIMEOUT) || 1000,
  },
  cloudinary: {
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  googleOauth: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  paystack: {
    baseUrl: process.env.PAYSTACK_BASE_URL,
    secret: process.env.PAYSTACK_SECRET,
    redirect: process.env.PAYSTACK_REDIRECT,
  },
};

export default config;
