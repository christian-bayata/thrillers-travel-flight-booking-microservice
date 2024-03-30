export class RetrieveBookingsDto {
  batch?: number;
  limit?: number;
  search?: string;
  userId: string;
  flag: string;
  filterStartDate?: string;
  filterEndDate?: string;
}
