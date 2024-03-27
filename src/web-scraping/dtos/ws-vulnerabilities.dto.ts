import {
  IsString,
  IsObject,
  IsArray,
  ArrayUnique,
  ArrayNotEmpty,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class Technologies {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly description: object;
}

export class CreateWSVulnerabilitiesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly customer: string;

  @ApiProperty()
  @IsArray()
  @ArrayUnique((dto) => dto.name)
  @ArrayNotEmpty()
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => Technologies)
  readonly technologies: Technologies[];
}
