import { Injectable } from '@nestjs/common';
import { fonts } from '@/common/fonts';

import PdfPrinter from 'pdfmake';
import type { TDocumentDefinitions, BufferOptions } from 'pdfmake/interfaces';

import { testPdfContent } from '../templates/pdf-test.template';

import * as fs from 'fs';

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

  async savePdf(
    docDefinition: TDocumentDefinitions,
    filePath: string,
    options: BufferOptions = {},
  ): Promise<void> {
    try {
      const pdfDoc = this.createPdf(docDefinition, options);

      const writeStream = fs.createWriteStream(filePath);
      pdfDoc.pipe(writeStream);
      pdfDoc.end();

      await new Promise<void>((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', (error: any) =>
          reject(new Error(`Error saving PDF: ${error.message}`)),
        );
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
