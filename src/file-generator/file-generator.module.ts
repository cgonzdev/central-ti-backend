import { Module } from '@nestjs/common';
import { FileService } from './services/file.service';
import { ExcelService } from './services/excel.service';

@Module({
  providers: [FileService, ExcelService],
  exports: [FileService, ExcelService],
})
export class FileGeneratorModule {}
