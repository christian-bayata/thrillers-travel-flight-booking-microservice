import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PropDataInput } from 'src/common/utils/util.interface';
// import { Plane, PlaneDocument } from './schemas/plane.schema';

@Injectable()
export class BookingRepository {
  constructor() {} // @InjectModel(Plane.name) private planeModel: Model<PlaneDocument>,

  /**
   * @Responsibility: Repo for creating a plane
   *
   * @param data
   * @returns {Promise<PlaneDocument>}
   */

  // async createPlane(data: any): Promise<PlaneDocument> {
  //   try {
  //     return await this.planeModel.create(data);
  //   } catch (error) {
  //     throw new Error(error?.messsage);
  //   }
  // }
}
