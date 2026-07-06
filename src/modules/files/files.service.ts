import { getFileType, validateFileSize } from '@configs';
import { FilesEntity } from '@infrastructure';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  statSync,
  unlinkSync,
} from 'fs';
import { extname, join } from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';
import { FilesRepository } from './files.repository';

@Injectable()
export class FilesService {
  constructor(private readonly filesRepository: FilesRepository) {}

  async uploadSingle(file: Express.Multer.File): Promise<FilesEntity> {
    try {
      validateFileSize(file);
    } catch (err) {
      this.safeUnlink(file.path);
      throw err;
    }

    const ext =
      extname(file.originalname).replace('.', '').toLowerCase() || 'bin';
    const fileType = getFileType(file.mimetype);

    const relativePath = file.path.replace(/\\/g, '/').replace(/^\.\//, '');
    const url = `/${relativePath}`;

    return await this.filesRepository.create({
      original_name: file.originalname,
      file_type: fileType,
      size: file.size,
      url,
      extension: ext,
    });
  }

  async uploadBulk(files: Express.Multer.File[]): Promise<FilesEntity[]> {
    const records = files.map((file) => {
      try {
        validateFileSize(file);
      } catch (err) {
        this.safeUnlink(file.path);
        throw err;
      }

      const ext =
        extname(file.originalname).replace('.', '').toLowerCase() || 'bin';
      const fileType = getFileType(file.mimetype);
      const relativePath = file.path.replace(/\\/g, '/').replace(/^\.\//, '');

      return {
        original_name: file.originalname,
        file_type: fileType,
        size: file.size,
        url: `/${relativePath}`,
        extension: ext,
      };
    });

    return await this.filesRepository.createMany(records);
  }

  async findOne(id: number): Promise<FilesEntity> {
    const file = await this.filesRepository.findOneOrFail({
      id,
    });

    return file;
  }
  async remove(id: number): Promise<{ message: string; success: boolean }> {
    const file = await this.findOne(id);
    await this.filesRepository.softDeleteOrFail({ id });

    const diskPath = `.${file.url}`;
    this.safeUnlink(diskPath);

    return { message: 'File deleted successfully', success: true };
  }

  async writeStream(source: Readable, destPath: string): Promise<void> {
    const writer = createWriteStream(destPath);
    await pipeline(source, writer);
  }

  async readStream(
    id: number,
    range: string | undefined,
    res: Response,
  ): Promise<void> {
    const file = await this.findOne(id);
    const diskPath = join(process.cwd(), file.url);

    if (!existsSync(diskPath)) {
      throw new NotFoundException(`File #${id} not found on disk`);
    }

    const { size } = statSync(diskPath);
    const mimeType = this.mimeFromExtension(file.extension);

    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : size - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mimeType,
      });

      createReadStream(diskPath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': size,
        'Content-Type': mimeType,
        'Accept-Ranges': 'bytes',
      });

      createReadStream(diskPath).pipe(res);
    }
  }

  private mimeFromExtension(ext: string): string {
    const map: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      mp4: 'video/mp4',
      webm: 'video/webm',
      mov: 'video/quicktime',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      pdf: 'application/pdf',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      zip: 'application/zip',
    };
    return map[ext.toLowerCase()] ?? 'application/octet-stream';
  }

  private safeUnlink(filePath: string): void {
    try {
      unlinkSync(filePath);
    } catch {
      // File already gone — ignore
    }
  }
}
