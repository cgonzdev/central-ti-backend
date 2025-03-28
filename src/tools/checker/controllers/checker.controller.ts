import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PdfService } from '@/file/services/pdf.service';

import { Response } from 'express';

@ApiTags('Project Tools Functionality Checker')
@Controller('tools/checker/pdf')
export class CheckerController {
  constructor(private pdfService: PdfService) {}

  @Get()
  @ApiOperation({ summary: 'Create a test PDF' })
  testPdf(@Res() response: Response) {
    const pdfDoc = this.pdfService.test();

    response.setHeader('Content-Type', 'application/pdf');

    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
