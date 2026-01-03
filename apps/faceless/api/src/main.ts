/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';

  // Raw body parsing for Stripe webhooks (must be before other middleware)
  app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3020;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
