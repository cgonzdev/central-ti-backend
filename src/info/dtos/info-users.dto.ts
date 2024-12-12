import {
  IsString,
  IsObject,
  IsArray,
  IsNotEmpty,
  ArrayNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateInfoUsersDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly user: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pass: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly link: string;
}

export class CreateManyInfoUsersDto {
  @ApiProperty()
  @IsArray()
  @ArrayNotEmpty()
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => CreateInfoUsersDto)
  readonly users: CreateInfoUsersDto[];
}

export class GetInfoUsersDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly user: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly pass: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly link: string;
}

export class UpdateInfoUsersDto extends PartialType(CreateInfoUsersDto) {}
