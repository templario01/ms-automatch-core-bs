import { Prisma } from '@prisma/client';

export type AccountWithRelations = Prisma.AccountGetPayload<{
  include: { favoriteVehicles: true, user: true };
}>;
