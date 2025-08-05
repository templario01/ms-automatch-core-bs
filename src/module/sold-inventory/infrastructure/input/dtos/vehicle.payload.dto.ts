type Website = {
  id: string;
  name: string;
  url: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
};

type Vehicle = {
  id: string;
  externalId: string;
  url: string;
  name: string;
  description: string | null;
  year: number;
  transmission: string | null;
  mileage: number;
  frontImage: string;
  images: string[] | null;
  location: string;
  condition: 'USED' | 'NEW';
  originalPrice: number;
  price: number;
  currency: 'USD' | 'PEN';
  createdAt: string;
  updatedAt: string;
  websiteId: string;
  status: 'ACTIVE' | 'INACTIVE';
  website: Website;
};

export type VehiclePayload = {
  soldVehicles: Vehicle[];
}