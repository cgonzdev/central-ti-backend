import { TDocumentDefinitions, StyleDictionary } from 'pdfmake/interfaces';

const styles: StyleDictionary = {
  header: {
    fontSize: 22,
    bold: true,
    alignment: 'center',
    margin: [0, 0, 0, 20],
  },
  body: {
    alignment: 'justify',
    margin: [0, 0, 20, 20],
  },
};

export const testPdfContent: TDocumentDefinitions = {
  styles,
  content: [
    {
      text: 'THIS IS A TEST PDF CREATION',
      style: 'header',
    },
    {
      text: `Lorem ipsum dolor sit amet lore mauris sed diam nonumy bibendum et just aliqu sapien sed diam nonumy bibendum`,
      style: 'body',
    },
  ],
};
