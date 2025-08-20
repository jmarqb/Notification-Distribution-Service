import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { REGEX_PASSWORD, REGEX_PHONE } from '../../common';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsOptional()
  _id?: string;

  @ApiProperty({
    required: true,
    example: 'John',
    description: 'Defining the user firstName',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(60)
  firstName: string;

  @ApiProperty({
    required: true,
    example: 'Doe',
    description: 'Defining the user lastName',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(60)
  lastName: string;

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
    example: '+53555558888',
    description: 'Defining the user phone',
    type: String,
  })
  @IsString()
  @IsOptional()
  @Matches(REGEX_PHONE, { message: 'phone must be a valid phone number' })
  @Transform(({ value }) => (value?.startsWith('+') ? value : `+${value}`))
  phone?: string;

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
