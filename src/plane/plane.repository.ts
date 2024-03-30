import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PropDataInput } from 'src/common/utils/util.interface';
import { Plane, PlaneDocument } from './schemas/plane.schema';
import { RetrievePlanesDto } from './dto/retrieve-planes.dto';
import { PlaneUtility } from './plane.utility';

@Injectable()
export class PlaneRepository {
  constructor(
    @InjectModel(Plane.name) private planeModel: Model<PlaneDocument>,
    private readonly planeUtility: PlaneUtility,
  ) {}

  /**
   * @Responsibility: Repo for creating a plane
   *
   * @param data
   * @returns {Promise<PlaneDocument>}
   */

  async createPlane(data: any): Promise<PlaneDocument> {
    try {
      return await this.planeModel.create(data);
    } catch (error) {
      throw new Error(error?.messsage);
    }
  }

  /**
   * @Responsibility: Repo to retrieve plane detail
   *
   * @param where
   * @returns {Promise<PlaneDocument>}
   */

  async findPlane(
    where: PropDataInput,
    attributes?: string,
  ): Promise<PlaneDocument> {
    return await this.planeModel.findOne(where).lean().select(attributes);
  }

  /**
   * @Responsibility: Repo for updating a plane
   *
   * @param where
   * @param data
   * @returns {Promise<PlaneDocument>}
   */

  async updatePlane(where: PropDataInput, data: any): Promise<PlaneDocument> {
    return await this.planeModel.findOneAndUpdate(where, data, {
      new: true,
    });
  }

  /**
   * @Responsibility: Repo for retrieving all planes
   *
   * @param where
   * @param data
   * @returns {Promise<PlaneDocument>}
   */

  async retrieveAllPlanes<T>({
    limit,
    batch,
    search,
  }: Partial<RetrievePlanesDto>): Promise<{ data: T[]; count: number }> {
    let data,
      query = {};

    if (search) {
      query['$or'] = [
        {
          manufacturer: new RegExp(search, 'i'),
        },
        {
          model: new RegExp(search, 'i'),
        },
        {
          capacity: new RegExp(search, 'i'),
        },
        {
          registrationNumber: new RegExp(search, 'i'),
        },
      ];
    }

    data =
      batch && limit
        ? await this.planeModel
            .find(query)
            .lean()
            .sort({ createdAt: -1 })
            .skip(this.planeUtility.paginationFunc(+batch, +limit))
            .limit(+limit)
        : await this.planeModel
            .find(query)
            .lean()
            .sort({ createdAt: -1 })
            .limit(10);
    const count = await this.planeModel.countDocuments(query);
    return { data, count };
  }

  /**
   * @Responsibility: Repo for deleting a plane
   *
   * @param where
   * @returns {Promise<PlaneDocument>}
   */

  async deletePlane(where: PropDataInput): Promise<PlaneDocument> {
    return await this.planeModel.findOneAndDelete(where);
  }
}
