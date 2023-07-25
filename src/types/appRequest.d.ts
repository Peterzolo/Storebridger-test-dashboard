/* eslint-disable @typescript-eslint/no-unused-vars */
import { Express } from 'express';

declare module 'express-serve-static-core' {
  interface Tokens {
    accessToken: string;
    refreshToken: string;
  }
  export interface Request {
    userId: string;
    accessToken: string;
    authId: string;
    email: string;
  }
}
