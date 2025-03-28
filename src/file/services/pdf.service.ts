import { Injectable } from '@nestjs/common';
import { fonts } from '@/common/fonts';

import PdfPrinter from 'pdfmake';
import type { TDocumentDefinitions, BufferOptions } from 'pdfmake/interfaces';

import { testPdfContent } from '../templates/pdf-test.template';

@Injectable()
export class PdfService {
  private printer = new PdfPrinter(fonts);
  test() {
    var docDefinition: TDocumentDefinitions = testPdfContent;

    return this.createPdf(docDefinition);
  }

  createPdf(
    docDefinition: TDocumentDefinitions,
    options: BufferOptions = {},
  ): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(docDefinition, options);
  }
}
