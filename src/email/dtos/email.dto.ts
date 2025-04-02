import {
  IsString,
  IsBoolean,
  IsEmail,
  IsUrl,
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

class Notices {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  readonly link: string;
}

class Newsletter {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsArray()
  @ArrayUnique((dto) => dto.title)
  @ArrayNotEmpty()
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => Notices)
  readonly notices: Notices[];
}

class Attachment {
  path: string;
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
  @IsArray()
  @ArrayUnique((dto) => dto.path)
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => Attachment)
  @IsOptional()
  readonly attachments: Attachment[];

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  readonly isHTML: boolean;
}

export class SendBulkEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly category: string;

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
}

export class SendNewsletterEmailDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  readonly to: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly subject: string;

  @ApiProperty()
  @IsArray()
  @ArrayUnique((dto) => dto.title)
  @ArrayNotEmpty()
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => Newsletter)
  readonly newsletter: Newsletter[];
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
  @IsString()
  @IsNotEmpty()
  readonly category: string;

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
