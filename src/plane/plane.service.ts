import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorResponse } from 'src/common/interfaces/error-response.interface';
import { CreatePlaneDto, UpdatePlaneDto } from './dto/create-plane.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PlaneRepository } from './plane.repository';
import { RetrievePlanesDto } from './dto/retrieve-planes.dto';
import { Observable, lastValueFrom } from 'rxjs';
import { SubscriberPattern } from 'src/common/interfaces/subscriber-pattern.interface';

@Injectable()
export class PlaneService {
  constructor(
    private readonly configService: ConfigService,
    private readonly planeRepository: PlaneRepository,
    @Inject('AUTH_SERVICE') private readonly clientAuthService: ClientProxy,
  ) {}

  private readonly ISE: string = 'Internal Server Error';

  /**
   * @Responsibility: flight booking service method to create a new plane info
   *
   * @param createPlaneDto
   * @returns {Promise<any>}
   */

  async createPlane(createPlaneDto: CreatePlaneDto): Promise<any> {
    try {
      const thePlane = await this.planeRepository.findPlane({
        registrationNumber: createPlaneDto?.registrationNumber,
      });
      if (thePlane) {
        throw new RpcException(
          this.errR({
            message: 'Plane already exists',
            status: HttpStatus.CONFLICT,
          }),
        );
      }

      function createPlaneData() {
        return {
          ...createPlaneDto,
          creator: createPlaneDto?.userId,
        };
      }

      return await this.planeRepository.createPlane(createPlaneData());
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
   * @Responsibility: flight booking service method to update plane info
   *
   * @param updatePlaneDto
   * @returns {Promise<any>}
   */

  async updatePlane(updatePlaneDto: UpdatePlaneDto): Promise<any> {
    try {
      const thePlane = await this.planeRepository.findPlane({
        _id: updatePlaneDto?.planeId,
      });
      if (!thePlane) {
        throw new RpcException(
          this.errR({
            message: 'Plane not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );
      }

      const { planeId, ...otherProps } = updatePlaneDto;

      await this.planeRepository.updatePlane(
        { _id: thePlane?._id },
        otherProps,
      );

      return {};
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
   * @Responsibility: flight booking service method to retrieve plane info
   *
   * @param planeId
   * @returns {Promise<any>}
   */

  async retrieveSinglePlane(planeId: string): Promise<any> {
    try {
      const thePlane = await this.planeRepository.findPlane({
        _id: planeId,
      });
      if (!thePlane) {
        throw new RpcException(
          this.errR({
            message: 'Plane not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );
      }

      return thePlane;
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
   * @Responsibility: flight booking service method to retrieve all planes with pagination
   *
   * @param retrievePlanesDto
   * @returns {Promise<any>}
   */

  async retrieveAllPlanes(retrievePlanesDto: RetrievePlanesDto): Promise<any> {
    try {
      const { limit, batch, search, userId } = retrievePlanesDto;
      const { data, count } =
        await this.planeRepository.retrieveAllPlanes<object>({
          limit,
          batch,
          search,
        });

      const result = await Promise.all(
        Array.from(data, async (index: any) => {
          /* Retrieve user data from the auth microservice */
          const userProfile: Observable<any> = this.clientAuthService.send<any>(
            { cmd: SubscriberPattern.USER_PROFILE },
            userId,
          );
          const theUserProfile = await lastValueFrom(userProfile);

          return {
            planeId: index?._id,
            manufacturer: index?.manufacturer,
            model: index?.model,
            capacity: index?.capacity,
            registrationNumber: index?.registrationNumber,
            creatorDetails: theUserProfile,
          };
        }),
      );
      return { result, count };
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
   * @Responsibility: flight booking service method to delete plane info
   *
   * @param planeId
   * @returns {Promise<any>}
   */

  async deleteSinglePlane(planeId: string): Promise<any> {
    try {
      const thePlane = await this.planeRepository.findPlane({
        _id: planeId,
      });
      if (!thePlane) {
        throw new RpcException(
          this.errR({
            message: 'Plane not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );
      }

      await this.planeRepository.deletePlane({ _id: thePlane?._id });

      return {};
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
