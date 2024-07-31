import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WebScrapingVulnDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly customer: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly site: string;
}
