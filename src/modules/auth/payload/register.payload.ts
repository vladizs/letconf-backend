import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsNotEmpty,
  Matches,
  MinLength,
} from 'class-validator';

export class RegisterPayload {
  @ApiProperty({ required: true, default: 'Test User' })
  @IsNotEmpty()
  @Matches(/[a-zA-Zа-яА-Я ]/)
  readonly name: string;

  @ApiProperty({ required: true, default: 'testuser' })
  @IsNotEmpty()
  @IsAlphanumeric()
  readonly username: string;

  @ApiProperty({ required: true, default: '12345678' })
  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
