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

  getImagePath(folder: string, name?: string) {
    if (!name) return `${appRoot.path}/src/assets/images/${folder}`;
    return `${appRoot.path}/src/assets/images/${folder}/${name}`;
  }

  async getLogo(name: string, ext: string) {
    try {
      const path = this.getImagePath('logos', `${name}.${ext}`);
      await fs.access(path);
      return path;
    } catch {
      return this.getImagePath('logos', `default.${ext}`);
    }
  }
}
