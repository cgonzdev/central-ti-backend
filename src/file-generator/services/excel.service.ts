import { Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const xl = require('excel4node');

@Injectable()
export class ExcelService {
  async generate(
    columns: string[],
    data: any[],
    sheet: string,
    filename: string,
  ) {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet(sheet);

    columns.forEach((column, index) => {
      ws.cell(1, index + 1).string(column);
    });

    data.forEach((row: any[], rowi: number) => {
      row.forEach((content: string, index: number) => {
        ws.cell(rowi + 2, index + 1).string(content);
      });
    });

    wb.write(`${filename}.xlsx`);
  }
}
