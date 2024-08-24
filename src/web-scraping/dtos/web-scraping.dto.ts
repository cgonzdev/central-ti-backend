import {
  IsString,
  IsDateString,
  IsEnum,
  IsObject,
  ValidateNested,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum EnumType {
  Technology = 'Technology',
  Customer = 'Customer',
  Group = 'Group',
}

class EmailToSend {
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
}

export class WebScrapingVulnDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly tag: string;

  @ApiProperty()
  @IsString()
  @IsEnum(EnumType)
  @IsNotEmpty()
  readonly type: EnumType;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly dateMin: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  readonly dateMax: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly site: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => EmailToSend)
  @IsOptional()
  readonly emailToSend: EmailToSend;
}
