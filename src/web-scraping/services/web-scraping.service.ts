import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import puppeteer from 'puppeteer';

import { WebScrapingVulnDto } from '../dtos/web-scraping.dto';
import { WSVulnerabilities } from '../entities/ws-vulnerabilities.entity';
import { ExcelService } from '@/file-generator/services/excel.service';

import { handleException } from '@/common/handle-exception';

@Injectable()
export class WebScrapingService {
  constructor(
    @InjectModel(WSVulnerabilities.name)
    private wsvDatabase: Model<WSVulnerabilities>,
    private excelService: ExcelService,
  ) {}

  async wsvuln(request: WebScrapingVulnDto) {
    const vuln_data = [];

    try {
      const data = await this.wsvDatabase
        .findOne({ customer: request.customer })
        .select('-_id -createdAt -updatedAt -__v -technologies._id')
        .exec();

      if (!data || data.deletedAt !== null) {
        throw new NotFoundException(
          `Record with customer => ${request.customer} not found`,
        );
      }

      const vulnInfo = JSON.parse(JSON.stringify(data));

      const baseURL =
        'https://www.incibe.es/incibe-cert/alerta-temprana/vulnerabilidades';

      const browser = await puppeteer.launch({
        headless: false,
        slowMo: 400,
      });
      const page = await browser.newPage();
      let dIndex = 0;

      for (const technology of vulnInfo.technologies) {
        const params = new URLSearchParams({
          field_vulnerability_title_es: technology.name,
          'field_vul_publication_date[min]': '2024-07-17',
          'field_vul_publication_date[max]': '2024-07-24',
          name: '',
          field_vul_product: '',
          field_vul_severity_txt_31: 'All',
          field_vul_vendor: '',
        });

        const site = `${baseURL}?${params.toString()}`;

        let attempt = 0;
        while (attempt < 5) {
          try {
            await page.goto(site, { waitUntil: 'load', timeout: 60000 });
            break;
          } catch (error) {
            console.log(`Attempt ${attempt + 1} failed: ${error.message}`);
            attempt++;
            await new Promise((res) => setTimeout(res, 5000));
            if (attempt >= 5) {
              console.log('Max retries reached. Unable to load the page.');
              await browser.close();
              throw new Error('Failed to load page after multiple attempts');
            }
          }
        }

        await page.setViewport({ width: 1080, height: 1024 });

        const vulnerabilities_links = await page.evaluate(() => {
          // verifies that the element containing the vulnerabilities exists
          const existsInfo = document.getElementById(
            'views-bootstrap-vulnerabilities-page-1',
          );

          // If it does not exist, do not continue with the scrapping process
          if (!existsInfo) return;

          // gets all nodes with the vulnerabilities
          const elements = document.querySelectorAll(
            '#views-bootstrap-vulnerabilities-page-1 a[href]',
          );

          // filters and returns only the urls
          const links = Array.from(elements).map((item) => {
            return item.getAttribute('href');
          });

          return links;
        });

        if (!vulnerabilities_links) {
          console.warn(`404 Not found for ${technology.name}`);
          vulnInfo.technologies[dIndex].incibe = false;
          dIndex++;
          continue;
        }

        console.info(`200 OK found for ${technology.name}`);

        for (const vuln of vulnerabilities_links) {
          await page.goto(`https://www.incibe.es/${vuln}`, {
            waitUntil: 'load',
            timeout: 60000,
          });
          const page_data = await page.evaluate(() => {
            const title = document.querySelector('.node-title').textContent;

            const CVE =
              document.querySelector('.breadcrumb').lastElementChild
                .textContent;

            const description = document.querySelector(
              '.field-vulnerability-description .content',
            ).textContent;

            const desc_div = document.querySelector(
              '.field-vulnerability-description',
            );

            const desc_div_data = Array.from(
              desc_div.children[0].querySelectorAll('.date'),
            );

            const data = desc_div_data.map((item) => {
              return item.textContent.trim();
            });

            const references = [];

            document
              .querySelectorAll('.field-vulnerability-documents a')
              .forEach((item) => references.push(item.getAttribute('href')));

            const severity = data[0];
            const type = data[1];
            const publishDate = data[2];
            const updateDate = data[3];

            return [
              title.trim(),
              CVE.trim(),
              description.trim(),
              severity.trim(),
              type.trim(),
              publishDate.trim(),
              updateDate.trim(),
              references.join('\n'),
            ];
          });

          page_data.splice(3, 0, technology.name.trim());
          vuln_data.push(page_data);
        }

        vulnInfo.technologies[dIndex].incibe = true;
      }

      dIndex++;
      console.log(vuln_data);

      await browser.close();
      return vulnInfo;
    } catch (exception) {
      handleException(exception);
      throw new ConflictException(`A conflict has occurredo: ${exception}`);
    } finally {
      if (vuln_data.length > 0) {
        this.excelService.generate(
          this.excelColumns(),
          vuln_data,
          'Vulnerabilities',
          'vuln',
        );
      }
    }
  }

  excelColumns(): string[] {
    return [
      'Title',
      'CVE',
      'Description',
      'Product',
      'Severity',
      'Type',
      'Publish date',
      'Update date',
      'References',
    ];
  }
}
