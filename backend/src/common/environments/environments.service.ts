import { Injectable, Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

export enum PROJECT_ENVS {
  DEV = 'development',
  PROD = 'production',
}

export const DefaultConfigs = {
  PORT: { value: '3000', validate: false },
  POSTGRES_HOST: { value: 'localhost', validate: true },
  POSTGRES_PORT: { value: '5432', validate: true },
  POSTGRES_USER: { value: 'postgres', validate: true },
  POSTGRES_PASS: { value: 'postgres', validate: true },
  POSTGRES_DB: { value: 'nest', validate: true },
  ENVIRONMENT: { value: 'development', validate: true },
  JWT_SECRET: { value: 'development', validate: true },
  ADMIN_KEY: { value: '', validate: false },
  PHONEPE_CLIENT_ID: { value: '', validate: false },
  PHONEPE_CLIENT_VERSION: { value: '1', validate: false },
  PHONEPE_CLIENT_SECRET: { value: '', validate: false },
  PHONEPE_ENV: { value: 'SANDBOX', validate: false },
  RAZORPAY_API_KEY: { value: '', validate: false },
  RAZORPAY_API_SECRET: { value: '', validate: false },
} as const;

@Injectable({
  durable: true,
})
export class Environments {
  private static logger = new Logger(Environments.name);

  public static get<K extends keyof typeof DefaultConfigs>(key: K): string {
    return process.env[key] ?? DefaultConfigs[key].value;
  }

  public static getNumber<K extends keyof typeof DefaultConfigs>(
    key: K,
  ): number {
    return Number(this.get(key));
  }

  public static getBoolean<K extends keyof typeof DefaultConfigs>(
    key: K,
  ): boolean {
    return this.get(key) === 'true';
  }

  public static validate() {
    if ((this.get('ENVIRONMENT') as PROJECT_ENVS) !== PROJECT_ENVS.PROD) return;

    const missing: string[] = [];

    for (const key of Object.keys(
      DefaultConfigs,
    ) as (keyof typeof DefaultConfigs)[]) {
      const config = DefaultConfigs[key];

      if (config.validate && !process.env[key]) {
        missing.push(key);
      }
    }

    if (missing.length > 0) {
      this.logger.error(
        `Missing required ENV variables: ${missing.join(', ')}`,
      );
      process.exit(1); // 🔥 fail fast (important in prod)
    }
  }
}
