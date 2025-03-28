import { Module } from '@nestjs/common';
import { FileService } from './services/file.service';
import { ExcelService } from './services/excel.service';
import { PdfService } from './services/pdf.service';

@Module({
  providers: [FileService, ExcelService, PdfService],
  exports: [FileService, ExcelService, PdfService],
})
export class FileModule {}
