import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNotEmpty, MinLength } from 'class-validator';

export class LoginPayload {
  @ApiProperty({ required: true, default: 'testuser' })
  @IsNotEmpty()
  @IsAlphanumeric()
  readonly username: string;

  @ApiProperty({ required: true, default: '12345678' })
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
