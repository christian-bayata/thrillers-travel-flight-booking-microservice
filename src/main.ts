import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { FlightBookingMsLogger } from './common/logger.interceptor';

async function bootstrap() {
  const logger = new Logger('FlightBookingMicroservice');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: 'auth_microservice',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  app.useGlobalInterceptors(new FlightBookingMsLogger());
  await app
    .listen()
    .finally(() =>
      logger.log(
        `Flight Booking Microservice: EventBus:${process.env.RABBITMQ_URL}`,
      ),
    );
}
bootstrap();
