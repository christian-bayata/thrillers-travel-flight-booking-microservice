import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorResponse } from 'src/common/interfaces/error-response.interface';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { BookingRepository } from './booking.repository';
import { Observable, lastValueFrom } from 'rxjs';
import { SubscriberPattern } from 'src/common/interfaces/subscriber-pattern.interface';

@Injectable()
export class BookingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly bookingRepository: BookingRepository,
    @Inject('AUTH_SERVICE') private readonly clientAuthService: ClientProxy,
  ) {}

  private readonly ISE: string = 'Internal Server Error';

  /**
   * @Responsibility: auth service method to create a new flight booking
   *
   * @param createPlaneDto
   * @returns {Promise<any>}
   */

  async createBooking(createPlaneDto: /* CreatePlaneDto */ ''): Promise<any> {}
}
