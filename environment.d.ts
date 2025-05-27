declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
      COOKIE_SECRET: string;
      NODE_ENV: 'development' | 'production';
      SMTP_USER: string;
      SMTP_PASS: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}