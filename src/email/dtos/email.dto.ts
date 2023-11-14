import {
  IsString,
  IsBoolean,
  IsEmail,
  IsObject,
  IsArray,
  ArrayUnique,
  ArrayNotEmpty,
  ValidateNested,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class Recipient {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly company: string;
}

export class SendEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly to: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly subject: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly body: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly attachment: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly isHTML: boolean;
}

export class CreateCustomerEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly customer: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly reason: string;

  @ApiProperty()
  @IsArray()
  @ArrayUnique((dto) => dto.email)
  @ArrayNotEmpty()
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => Recipient)
  readonly to: Recipient[];

  @ApiProperty()
  @IsArray()
  @ArrayUnique((dto) => dto.email)
  @ArrayNotEmpty()
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => Recipient)
  readonly cc: Recipient[];
}

export class UpdateCustomerEmailDto extends PartialType(
  CreateCustomerEmailDto,
) {}
