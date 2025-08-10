import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  @ApiProperty({
    description: 'JWT Token Type',
    example: 'Bearer',
  })
  readonly tokenType: string;

  @ApiProperty({
    description: 'JWT Token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  readonly token: string;

  @ApiProperty({
    description: 'Token expiration time',
    example: '1d',
  })
  readonly expiresIn: string;
}
