import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { FlightBookingMsLogger } from './common/logger.interceptor';
import * as http from 'http';

async function bootstrap() {
  const logger = new Logger('FlightBookingMicroservice');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: 'flight_booking_microservice',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  app.useGlobalInterceptors(new FlightBookingMsLogger());

  // /* This is because Render requires http port binding for deployment */
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.end('This is a placeholder HTTP response');
  });

  server.listen(5002);

  await app
    .listen()
    .finally(() =>
      logger.log(
        `Flight Booking Microservice: EventBus:${process.env.RABBITMQ_URL}`,
      ),
    );
}
bootstrap();
