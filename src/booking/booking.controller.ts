import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { BookingService } from './booking.service';
import { SubscriberPattern } from '../common/interfaces/subscriber-pattern.interface';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern({ cmd: SubscriberPattern.CREATE_PLANE })
  async createPlane(
    @Payload() createPlaneDto: /* CreatePlaneDto */ '',
  ): Promise<any> {
    return await this.bookingService.createBooking(createPlaneDto);
  }
}
