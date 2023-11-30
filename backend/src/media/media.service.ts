import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { resolve } from 'path';
import { pathExists } from 'fs-extra';
import { Response } from 'express';

@Injectable()
export class MediaService {
  logger = new Logger('media service');
  getFilePath(path: string): string {
    const filePath = resolve(process.cwd(), 'media', path);
    return filePath;
  }

  async getFileObject(id: string, res: Response) {
    try {
      const isPathExists = await pathExists(this.getFilePath(id));
      if (isPathExists) {
        return res.sendFile(this.getFilePath(id));
      } else throw new NotFoundException();
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getFileBinary(id: string, res: Response) {
    try {
      const isPathExists = await pathExists(this.getFilePath(id));
      if (isPathExists) {
        return res.download(this.getFilePath(id));
      } else throw new NotFoundException();
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async addMedia(files: any[]) {
    const mediaList = files.map(async (file) => {
      return file.filename;
    });
    return await Promise.all(mediaList);
  }
}
