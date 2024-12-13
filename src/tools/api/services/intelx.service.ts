import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

import { FileService } from '@/file/services/file.service';
import { ExcelService } from '@/file/services/excel.service';

import { SearchIntelxDto } from '../dtos/intelx.dto';

@Injectable()
export class IntelxService {
  private apiKey: any;

  constructor(
    private readonly httpService: HttpService,
    private readonly fileService: FileService,
    private readonly excelService: ExcelService,
    @Inject('configService') private configService,
  ) {
    this.apiKey = configService.intelx;
  }

  async search(term: SearchIntelxDto) {
    const URL = 'https://2.intelx.io';
    const config: any = { headers: { 'x-key': this.apiKey } };

    try {
      const search = await lastValueFrom(
        this.httpService.post(`${URL}/intelligent/search`, term, config),
      );

      if (search.data?.status !== 0) {
        return new Error(`Invalid term or max concurrent searches per api key`);
      }

      config.params = { id: search.data.id, limit: term.maxresults };

      const result = await lastValueFrom(
        this.httpService.get(`${URL}/intelligent/search/result`, config),
      );

      if (result.data?.status === 2) {
        return new Error(`Search ID not found`);
      }

      const records = result.data.records;

      const leaksData = records.map((record: any) => [
        record.systemid,
        record.date,
        record.name,
        record.xscore.toString(),
        record.bucket,
        record.mediah,
      ]);

      const total = records.length;
      let ignore = 0;
      let leak = 0;

      for (const [index, record] of records.entries()) {
        const nameLowerCase = record.name.toLowerCase();

        config.params = {
          f: 0,
          storageid: record.storageid,
          bucket: record.bucket,
        };

        if (
          !term.ignoreForView.some((ignore) => nameLowerCase.includes(ignore))
        ) {
          await new Promise((res) => setTimeout(res, 1000));

          const fileView = await lastValueFrom(
            this.httpService.get(`${URL}/file/view`, config),
          );
          const fileText = fileView.data;

          const matches = this.extractWithContext(fileText, term.term);

          if (matches.length > 0) {
            leaksData[index].push(
              matches.map(
                (item) => `${item.match}\n\n${item.context.join('\n')}\n\n`,
              ),
            );
          }

          leak++;
        } else ignore++;
      }

      const columns = [
        'systemid',
        'date',
        'name',
        'xscore',
        'bucket',
        'mediah',
        'matched-data',
      ];

      const excelName = this.fileService.getFilePath('') + 'export';

      this.excelService.generate(columns, leaksData, 'intelx', excelName);

      config.params = { id: search.data.id };
      await lastValueFrom(
        this.httpService.get(`${URL}/intelligent/search/terminate`, config),
      );

      return {
        total: total,
        leak: leak,
        ignore: ignore,
        records: leaksData,
      };
    } catch (error) {
      return new Error(`HTTP request error: ${error.message}`);
    }
  }

  extractWithContext(content: string, keyword: string, contextLines = 3) {
    const lines = content.split('\n');
    const regex = new RegExp(keyword, 'i');
    const results = [];
    let lastCapturedIndex = -Infinity;

    lines.forEach((line, index) => {
      if (regex.test(line)) {
        if (index > lastCapturedIndex + contextLines) {
          const start = Math.max(0, index - contextLines);
          const end = Math.min(lines.length - 1, index + contextLines);

          const context = lines.slice(start, end + 1);

          results.push({
            match: line.trim(),
            context,
          });

          lastCapturedIndex = index;
        }
      }
    });

    return results;
  }
}
