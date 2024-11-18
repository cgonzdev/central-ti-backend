import { Injectable, ConflictException } from '@nestjs/common';

import puppeteer, { Browser, Page } from 'puppeteer';

import { EnumType, WebScrapingVulnDto } from '../dtos/web-scraping.dto';
import { ExcelService } from '@/file/services/excel.service';
import { EmailService } from '@/email/services/email.service';
import { FileService } from '@/file/services/file.service';

import { handleException } from '@/common/handle-exception';
import { WSVulnerabilitiesService } from './ws-vulnerabilities.service';

@Injectable()
export class WebScrapingService {
  vuln_data = []; //* Global variable
  excelName = null;

  constructor(
    private wsvService: WSVulnerabilitiesService,
    private excelService: ExcelService,
    private emailService: EmailService,
    private fileService: FileService,
  ) {}

  async wsvuln(request: WebScrapingVulnDto) {
    try {
      this.vuln_data = [];
      this.excelName = this.fileService.getFilePath('');

      console.log('------------------------------------------');
      console.log('Welcome to the web scraping process! \n');
      console.log('Site: ' + request.site);
      console.log('Tag: ' + request.tag);
      console.log('Start date: ' + request.dateMin);
      console.log('End date: ' + request.dateMax);
      console.log('------------------------------------------');

      const browser: Browser = await puppeteer.launch({
        headless: false,
        slowMo: 400,
      });

      if (request.type === EnumType.Customer) {
        const vulnInfo = await this.wsvService.getByTag(request.tag);

        if (vulnInfo) {
          this.excelName += `${vulnInfo.tag}_${request.dateMin}_${request.dateMax}`;
          for (const technology of vulnInfo.technologies) {
            const incibeParams = {
              technology: technology.name,
              owner: technology.owner,
              dateMin: request.dateMin,
              dateMax: request.dateMax,
            };

            await this.incibe(browser, incibeParams);
          }
        }
      } else if (request.type === EnumType.Technology) {
        this.excelName += request.tag;
        const incibeParams = JSON.parse(JSON.stringify(request));
        if (request.site === 'INCIBE') {
          incibeParams.technology = request.tag;
          await this.incibe(browser, incibeParams);
        }
      }

      await browser.close();

      return 'ok';
    } catch (exception) {
      handleException(exception);
      throw new ConflictException(`A conflict has occurredo: ${exception}`);
    } finally {
      if (this.vuln_data.length > 0) {
        this.excelExport(this.vuln_data, 'Vulnerabitilies', this.excelName);
        if (request.emailToSend) {
          this.emailService.send({
            to: request.emailToSend.to,
            subject: request.emailToSend.subject,
            body: request.emailToSend.body,
            attachment: `${this.excelName}.xlsx`,
            isHTML: true,
          });

          await this.fileService.deleteFile(`${this.excelName}.xlsx`);
        }
      }
    }
  }

  async incibe(browser: Browser, request: any) {
    const baseURL =
      'https://www.incibe.es/incibe-cert/alerta-temprana/vulnerabilidades';

    const params = new URLSearchParams({
      field_vulnerability_title_es: request.technology,
      'field_vul_publication_date[min]': request.dateMin,
      'field_vul_publication_date[max]': request.dateMax,
      name: '',
      field_vul_product: '',
      field_vul_severity_txt_31: 'All',
      field_vul_vendor: '',
    });

    try {
      // Create a new page in the browser
      const page: Page = await browser.newPage();
      const site = `${baseURL}?${params.toString()}`;

      // Try to establish a connection with the website, with a maximum of 5 attempts at 5 second intervals if there are failures
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

      // Set the browser viewport
      await page.setViewport({ width: 1080, height: 1024 });

      // Verify that a class exists, from here it is determined whether or not there are results
      const existsInfo = await page.$(
        '#views-bootstrap-vulnerabilities-page-1',
      );

      if (!existsInfo) {
        console.warn(`404 Not found for ${request.technology}`);
        await page.close();
        return 404;
      }

      // Check if the class that determines pagination exists.
      const pager = await page.$('.pager');
      let nextPage = null;

      // Run the entire information gathering process at least once. If pager is set, the loop continues until the pages end
      do {
        // Gets the links where the vulnerabilities information is
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

        // If there are no links, return
        if (!vulnerabilities_links) {
          return 404;
        }

        // If links exist, report a status of ok and create a new tab
        console.info(`200 OK found for ${request.technology}`);
        const newPage = await browser.newPage();

        // It iterates over the number of links in a loop [for ... of], to handle asynchrony
        for (const vuln of vulnerabilities_links) {
          // Go to the specific link of the vulnerability
          await newPage.goto(`https://www.incibe.es/${vuln}`, {
            waitUntil: 'load',
            timeout: 60000,
          });

          // Evaluate and return all necessary data
          const page_data = await newPage.evaluate(() => {
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
            const publishDate = data[2];
            const updateDate = data[3];

            return [
              title.trim(),
              CVE.trim(),
              description.trim(),
              severity.trim(),
              publishDate.trim(),
              updateDate.trim(),
              references.join('\n'),
            ];
          });

          // The data is added to the array for later use
          page_data.splice(3, 0, request.technology.trim());

          if (request.owner) page_data.push(request.owner);

          this.vuln_data.push(page_data);
        }

        // The previously created tab is closed
        await newPage.close();

        // Check if a new page exists in the search pager
        nextPage = await page.$('.pager a[rel="next"]');

        // If it exists, on the first page, it simulates a click on the next page and continues the loop
        if (nextPage) {
          await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            page.click('.pager a[rel="next"]'),
          ]);
        }
      } while (pager && nextPage);

      await page.close();
      return 'ok';
    } catch (exception) {
      handleException(exception);
      throw new ConflictException(`A conflict has occurredo: ${exception}`);
    }
  }

  excelExport(data: any, sheetName: string, xlsxName: string) {
    const columns = [
      'Title',
      'CVE',
      'Description',
      'Product',
      'Severity',
      'Publish date',
      'Update date',
      'References',
      'Owner',
    ];

    this.excelService.generate(columns, data, sheetName, xlsxName);
  }
}
