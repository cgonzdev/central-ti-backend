import {
  IsString,
  IsNumber,
  IsArray,
  ArrayUnique,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchIntelxDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly term: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  readonly buckets: [] = [];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly lookuplevel: number = 0;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly maxresults: number = 1000;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly timeout: number = 0;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly datefrom: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly dateto: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly sort: number = 0;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly media: number = 0;

  @ApiProperty()
  @IsArray()
  @ArrayUnique((dto) => dto)
  @IsString({ each: true })
  readonly terminate: [] = [];

  @ApiProperty()
  @IsArray()
  @ArrayUnique((dto) => dto)
  @IsString({ each: true })
  readonly ignoreForView: [] = [];
}
