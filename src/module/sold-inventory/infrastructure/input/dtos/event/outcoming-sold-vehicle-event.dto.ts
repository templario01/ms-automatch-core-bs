type VehicleInformation = Readonly<{
  id: string;
  externalId: string;
  url: string;
  name: string;
  description: string | null;
  year: number;
  mileage: number;
  frontImage: string;
  location: string;
  condition: 'USED' | 'NEW';
  originalPrice: number;
  price: number;
  currency: 'USD' | 'PEN';
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE' | 'INACTIVE';
  website: string;
}>;

type SoldFavoriteVehicle = Readonly<{
  favoriteVehicleId: string;
  vehicle: VehicleInformation;
}>;

export type NotifyUserSoldVehicleEventDto = Readonly<{
  email: string;
  accountId: string;
  soldVehicles: SoldFavoriteVehicle[];
}>;
