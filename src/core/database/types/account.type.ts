import { Prisma } from '@prisma/client';

export type AccountWithRelations = Prisma.AccountGetPayload<{
  include: { favoriteVehicles: true; user: true };
}>;

export type UserWithAccount = Prisma.UserGetPayload<{
  include: { account: true };
}>;
