import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { REGEX_PASSWORD } from '../../common';

export class LoginUserDto {
  @ApiProperty({
    required: true,
    example: 'jonhdoe@gmail.com',
    description: 'Defining the user email',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    required: true,
    example: 'Abc123',
    description: 'Defining the user password',
    type: String,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @IsNotEmpty()
  @Matches(REGEX_PASSWORD, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
