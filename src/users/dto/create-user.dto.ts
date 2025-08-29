import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString({ message: 'first_name must be a text' })
  @MaxLength(255)
  @MinLength(2)
  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  first_name: string;

  @IsNotEmpty()
  @IsString({ message: 'last_name must be a text' })
  @MaxLength(255)
  @MinLength(2)
  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  last_name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'email must be a valid email address' })
  @MaxLength(255)
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @IsOptional()
  @IsString({ message: 'phone must be a text' })
  @MaxLength(20)
  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
  })
  phone?: string;
}
