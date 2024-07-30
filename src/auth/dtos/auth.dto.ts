import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty()
  @IsMongoId({ message: 'ID not valid' })
  @IsNotEmpty()
  readonly id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
