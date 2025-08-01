import { Column, TDocumentDefinitions } from 'pdfmake/interfaces';
import { incibeInterface } from '../helpers/formatting.helper';

import dayjs from 'dayjs';

const logoCompany: Column = {
  stack: [
    {
      image: 'src/assets/images/logos/company.png',
      width: 102,
      alignment: 'center',
      margin: [125, 3, 0, 0],
    },
  ],
  width: '*',
};

const logoCustomer = (logo: string): Column => ({
  stack: [
    {
      image: logo,
      width: 102,
      alignment: 'right',
      margin: [0, 10, 10, 0],
    },
  ],
  width: '*',
});

const reserved: Column = {
  table: {
    headerRows: 1,
    widths: ['auto'],
    body: [
      [
        {
          text: 'CONFIDENTIAL INFORMATION',
          color: '#FA8072',
          border: [true, true, true, true],
          borderColor: ['#FA8072', '#FA8072', '#FA8072', '#FA8072'],
          fontSize: 6,
        },
      ],
    ],
  },
  layout: {
    hLineWidth: function () {
      return 0.0001;
    },
    vLineWidth: function () {
      return 0.0001;
    },
  },
  width: 'auto',
  alignment: 'center',
  margin: [0, 20, 0, 0],
};

const textFooter = (pageCount: number): Column => {
  return {
    text: `Vulnerabilities report - v1 \t ${pageCount}`,
    fontSize: 8,
    alignment: 'left',
    margin: [30, 0, 0, 0],
    width: '*',
  };
};

const linkReferences = (references: string[]) => {
  const links = [];

  references.forEach((reference) => {
    links.push({ text: reference, link: reference });
  });

  return links;
};

const vulnerabilitiesContent = (
  vulns: any,
  dates: { start: string; end: string },
) => {
  const data = [];

  //* First page

  data.push({
    text: 'Fisrt page',
    alignment: 'center',
    fontSize: 16,
    bold: true,
    margin: [0, 0, 0, 15],
  });

  data.push({
    text: 'This is the first page of the report, where the cover page or anything else should go according to the customization you want to give it.',
    alignment: 'justify',
    margin: [0, 0, 0, 30],
  });

  data.push({
    text: `${dayjs(dates.start).format('MMMM D[,] YYYY')} - ${dayjs(dates.end).format('MMMM D[,] YYYY')}`,
    pageBreak: 'after',
  });

  //* Tabla

  data.push({
    text: 'Vulnerabilities',
    alignment: 'center',
    fontSize: 16,
    bold: true,
    margin: [0, 0, 0, 15],
  });

  data.push({
    text: 'The following vulnerabilities have been found in products from the following manufacturers. It is recommended that you review the information and apply the necessary recommendations to mitigate the risk.',
    alignment: 'justify',
    margin: [0, 0, 0, 30],
  });

  const countVulns = Object.entries(
    vulns.reduce((acc: any, { product }) => {
      acc[product] = (acc[product] || 0) + 1;
      return acc;
    }, {}),
  ).map(([product, count]) => [
    {
      text: product,
      bold: true,
      border: [true, true, true, true],
      fillColor: '#E3E2DA',
      borderColor: ['#FFF', '#FFF', '#FFF', '#FFF'],
    },
    {
      text: count.toString(),
      alignment: 'center',
      border: [true, false, false, true],
      borderColor: ['#E3E2DA', null, null, '#E3E2DA'],
    },
  ]);

  const tableHead = [
    {
      text: 'Manufacturer',
      alignment: 'center',
      bold: true,
      border: [false, true, false, true],
      borderColor: [null, '#37474f', null, '#37474f'],
    },
    {
      text: 'Count',
      alignment: 'center',
      bold: true,
      border: [false, true, false, true],
      borderColor: [null, '#37474f', null, '#37474f'],
    },
  ];

  data.push({
    table: {
      headerRows: 1,
      widths: ['*', '*'],
      body: [tableHead, ...countVulns],
    },
  });

  data.push({ text: '', pageBreak: 'after' });

  //* Body

  vulns.forEach((vuln: any, index: number) => {
    data.push({
      ol: [
        {
          text: vuln.title,
          fontSize: 16,
          bold: true,
          counter: index + 1,
        },
      ],
    });
    data.push({ text: '\n\n' });
    data.push({
      type: 'none',
      ul: [
        { text: [{ text: 'CVE: ', bold: true }, { text: vuln.cve }] },
        {
          text: [
            { text: 'Publish data: ', bold: true },
            { text: vuln.publishDate },
          ],
        },
        {
          text: [
            { text: 'Update date: ', bold: true },
            { text: vuln.updateDate },
          ],
        },
        {
          text: [{ text: 'Severity: ', bold: true }, { text: vuln.severity }],
        },
      ],
    });
    data.push({ text: '\n\n' });
    data.push({ text: 'Description', bold: true });
    data.push({ text: '\n' });
    data.push({
      text: vuln.description,
      alignment: 'justify',
    });
    data.push({ text: '\n\n' });
    data.push({ text: 'References', bold: true });
    data.push(linkReferences(vuln.references));
    data.push({ text: '', pageBreak: 'before' });
  });

  //* Last page

  data.push({
    text: 'Last page',
    alignment: 'center',
    fontSize: 16,
    bold: true,
    margin: [0, 0, 0, 15],
  });

  data.push({
    text: 'This is the last page of the report. Here you can add additional information such as contact information, references, etc., or any other information you wish.',
    alignment: 'justify',
    margin: [0, 0, 0, 30],
  });

  return data;
};

//: functions header and footer: the first and last page is reserved for the cover
export const incibeVulnTemplatePdf = (
  vulnerabilities: incibeInterface[],
  logoCustomerPath: string,
  dates: { start: string; end: string },
): TDocumentDefinitions => ({
  pageSize: 'A4',
  pageMargins: [40, 60, 40, 50],
  header: function (currentPage, pageCount) {
    if (currentPage === 1 || currentPage === pageCount) {
      return null;
    }

    return { columns: [logoCustomer(logoCustomerPath)] };
  },
  content: vulnerabilitiesContent(vulnerabilities, dates),
  footer: function (currentPage, pageCount) {
    if (currentPage === 1 || currentPage === pageCount) {
      return null;
    }

    return [
      {
        columns: [logoCompany, reserved, textFooter(currentPage)],
      },
    ];
  },
  defaultStyle: {
    font: 'Roboto',
    color: '#37474f',
    fontSize: 10,
  },
});
