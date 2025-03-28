const appRoot = require('app-root-path');

const path = `${appRoot.path}/src/assets/fonts`;

export const fonts = {
  Roboto: {
    normal: `${path}/Roboto-Regular.ttf`,
    bold: `${path}/Roboto-Bold.ttf`,
    italics: `${path}/Roboto-RegularItalic.ttf`,
    bolditalics: `${path}/Roboto-BoldItalic.ttf`,
  },
};
