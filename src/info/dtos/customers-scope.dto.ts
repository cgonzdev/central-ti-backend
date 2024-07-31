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
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class Leaders {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}

class Services {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  readonly enabled: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly icon: string;
}

export class CreateCustomerScopeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly acronym: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly logo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly owner: string;

  @ApiProperty()
  @IsArray()
  @ArrayUnique((dto) => dto.email)
  @ArrayNotEmpty()
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => Leaders)
  readonly leaders: Leaders[];

  @ApiProperty()
  @IsArray()
  @ArrayUnique((dto) => dto.name)
  @ArrayNotEmpty()
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => Services)
  readonly services: Services[];
}

export class UpdateCustomerScopeDto extends PartialType(
  CreateCustomerScopeDto,
) {}
