import {
  IsString,
  IsEmail,
  IsArray,
  MinLength,
  Matches,
  ArrayUnique,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly description: string;

  @ApiProperty()
  @IsArray()
  @ArrayUnique((dto) => dto)
  @IsString({ each: true })
  @IsOptional()
  readonly roles: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
