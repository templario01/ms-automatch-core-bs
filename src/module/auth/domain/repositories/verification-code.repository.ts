import { Injectable } from '@nestjs/common';
import { VerificationCode } from '../entities/validation-code';

@Injectable()
export abstract class IVerificationCodeRepository {
  abstract generateVerificationCode(): Promise<string>;
  abstract createVerificationCode(
    email: string,
    code: string,
  ): Promise<VerificationCode>;
}
