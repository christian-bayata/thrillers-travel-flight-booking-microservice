import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as moment from 'moment';
import { Moment } from 'moment';
import { BookingStatus } from '../interfaces/utils/util.enum';

export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
  @Prop({ type: String, required: true })
  bookerId: string;

  @Prop({ type: String, required: true })
  flightNumber: string;

  @Prop({ type: String, required: true })
  departureAirportCode: string;

  @Prop({ type: String, required: true })
  arrivalAirportCode: string;

  @Prop({ type: String, default: BookingStatus.PENDING })
  status: string;

  @Prop({ type: Date, required: true })
  departureDate: Date;

  @Prop({ type: Date, required: true })
  arrivalDate: Date;

  @Prop({ type: String, required: true })
  planeId: string;

  @Prop({ default: () => moment().utc().toDate(), type: Date })
  createdAt: Moment;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);