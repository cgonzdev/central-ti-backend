import { Injectable } from '@nestjs/common';

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs').promises;
const appRoot = require('app-root-path');

@Injectable()
export class FileService {
  async uploadFile() {}

  async deleteFile(path: string) {
    try {
      await fs.unlink(path);
      console.log('File deleted successfully');
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  }

  getFilePath(name: string) {
    return `${appRoot.path}/src/assets/files/${name}`;
  }

  getImagePath(name: string) {
    return `${appRoot.path}/src/assets/images/${name}`;
  }
}
