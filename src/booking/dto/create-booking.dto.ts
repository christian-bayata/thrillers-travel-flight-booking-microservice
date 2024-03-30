export class CreateBookingDto {
  readonly flightNumber: string;
  readonly departureAirportCode: string;
  readonly arrivalAirportCode: string;
  readonly departureDate: string;
  readonly arrivalDate: string;
  readonly planeId: string;
  userId: string;
}
