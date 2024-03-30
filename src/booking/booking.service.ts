import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorResponse } from 'src/common/interfaces/error-response.interface';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { BookingRepository } from './booking.repository';
import { Observable, lastValueFrom } from 'rxjs';
import { SubscriberPattern } from 'src/common/interfaces/subscriber-pattern.interface';
import { CreateBookingDto } from './dto/create-booking.dto';

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

  async createBooking(createBookingDto: CreateBookingDto): Promise<any> {
    try {
      const { userId, ...otherProps } = createBookingDto;

      function createBookingData() {
        return {
          ...otherProps,
          bookerId: userId,
        };
      }

      return await this.bookingRepository.createBooking(createBookingData());
    } catch (error) {
      throw new RpcException(
        this.errR({
          message: error?.message ? error.message : this.ISE,
          status: error?.error?.status,
        }),
      );
    }
  }

  /*****************************************************************************************************************************
   *
   ****************************************PRIVATE FUNCTIONS/METHODS **********************************
   *
   ******************************************************************************************************************************
   */

  private errR(errorInput: { message: string; status: number }): ErrorResponse {
    return {
      message: errorInput.message,
      status: errorInput.status,
    };
  }
}
