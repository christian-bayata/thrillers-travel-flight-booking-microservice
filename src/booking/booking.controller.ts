import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { BookingService } from './booking.service';
import { SubscriberPattern } from '../common/interfaces/subscriber-pattern.interface';
import { CreateBookingDto } from './dto/create-booking.dto';
import { RetrieveBookingsDto } from './dto/retrieve-bookings.dto';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern({ cmd: SubscriberPattern.CREATE_BOOKING })
  async createPlane(
    @Payload() createBookingDto: CreateBookingDto,
  ): Promise<any> {
    return await this.bookingService.createBooking(createBookingDto);
  }

  @MessagePattern({ cmd: SubscriberPattern.RETRIEVE_ALL_BOOKINGS })
  async retrieveAllBookings(
    @Payload() retrieveAllBookingsDto: RetrieveBookingsDto,
  ): Promise<any> {
    return await this.bookingService.retrieveAllBookings(
      retrieveAllBookingsDto,
    );
  }
}
