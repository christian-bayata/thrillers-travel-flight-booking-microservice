import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorResponse } from 'src/common/interfaces/error-response.interface';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { BookingRepository } from './booking.repository';
import { Observable, lastValueFrom } from 'rxjs';
import { SubscriberPattern } from 'src/common/interfaces/subscriber-pattern.interface';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RetrieveBookingsDto } from './dto/retrieve-bookings.dto';

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

  /**
   * @Responsibility: flight booking service method to retrieve all flight bookings with pagination
   *
   * @param retrieveBookingsDto
   * @returns {Promise<any>}
   */

  async retrieveAllBookings(
    retrieveBookingsDto: RetrieveBookingsDto,
  ): Promise<any> {
    try {
      const {
        limit,
        batch,
        search,
        userId,
        flag,
        filterStartDate,
        filterEndDate,
      } = retrieveBookingsDto;
      const { data, count } =
        await this.bookingRepository.retrieveAllBookings<object>({
          limit,
          batch,
          search,
          userId,
          flag,
          filterStartDate,
          filterEndDate,
        });

      return { data, count };
    } catch (error) {
      throw new RpcException(
        this.errR({
          message: error?.message ? error.message : this.ISE,
          status: error?.error?.status,
        }),
      );
    }
  }

  /**
   * @Responsibility: flight booking service method to retrieve single flight booking info
   *
   * @param bookingId
   * @returns {Promise<any>}
   */

  async retrieveSingleBooking(bookingId: string): Promise<any> {
    try {
      const theBoking = await this.bookingRepository.findBooking({
        _id: bookingId,
      });
      if (!theBoking) {
        throw new RpcException(
          this.errR({
            message: 'Plane not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );
      }

      return theBoking;
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
