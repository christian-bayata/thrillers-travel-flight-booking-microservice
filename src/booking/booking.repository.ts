import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PropDataInput } from 'src/common/utils/util.interface';
import { Booking, BookingDocument } from './schemas/booking.schema';

@Injectable()
export class BookingRepository {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  /**
   * @Responsibility: Repo for creating a booking
   *
   * @param data
   * @returns {Promise<BookingDocument>}
   */

  async createBooking(data: any): Promise<BookingDocument> {
    try {
      return await this.bookingModel.create(data);
    } catch (error) {
      throw new Error(error?.messsage);
    }
  }
}
