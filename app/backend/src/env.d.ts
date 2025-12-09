declare namespace NodeJS {
  interface ProcessEnv {
    JWT_ACCESS_SECRET: string;
    ACCESS_TOKEN_EXPIRES: string;
    JWT_REFRESH_SECRET: string;
    REFRESH_TOKEN_EXPIRES: string;
    NODE_ENV: "development" | "production";
  }
}
