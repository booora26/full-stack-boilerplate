import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import passport from 'passport';
import * as session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import Redis from 'ioredis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Api example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RedisStore = require('connect-redis').default;
  const redis = new Redis({
    port: configService.get<number>('REDIS_PORT'), // Redis port
    host: configService.get<string>('REDIS_HOST'), // Redis host
  });

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
        prefix: 'app:',
      }),
      secret: configService.get<string>('SESS_SECRET'),
      resave: configService.get<boolean>('SESS_RESAVE'),
      saveUninitialized: configService.get<boolean>('SESS_SAVE_UNITIALIZED'),
      cookie: {
        // secure: configService.get<boolean>('SESS_COOKIE_SECURE'),
        // maxAge converted from ms to minutes
        maxAge:
          parseInt(configService.get<string>('SESS_COOKIE_MAX_AGE')) *
          60 *
          1000,
        // maxAge: 90000
      },
      name: configService.get<string>('SESS_NAME'),
      rolling: configService.get<boolean>('SESS_ROLLING'),
    }),
  );

  // app.use(passport.initialize());
  // app.use(passport.session());
  app.enableCors({ credentials: true, origin: true });

  await app.listen(4010);
}
bootstrap();
