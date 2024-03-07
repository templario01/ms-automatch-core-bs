import {
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new UnprocessableEntityException();
    }
    if (error instanceof HttpException) {
      throw error;
    }

    throw new InternalServerErrorException();
  }
}
