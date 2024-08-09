import { IsString, IsDateString, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum EnumType {
  Technology = 'Technology',
  Customer = 'Customer',
  Group = 'Group',
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
}
