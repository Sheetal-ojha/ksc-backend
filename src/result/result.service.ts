import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './result.entity';
import { huffmanCompress, huffmanDecompress } from '../common/huffman.util';

@Injectable()
export class ResultService {
  constructor(@InjectRepository(Result) private repo: Repository<Result>) {}

  private compress(data?: string) {
    if (!data) return undefined;
    return huffmanCompress(Buffer.from(data, 'base64'));
  }

  private decompress(data?: string) {
    if (!data) return undefined;
    return huffmanDecompress(data).toString('base64');
  }

  async create(teacherId: string, classId: string, depId: string, title: string, description?: string, file_data?: string, image_data?: string) {
    const result = this.repo.create({
      teacher: { id: teacherId } as any,
      class_id: classId,
      dep_id: depId,
      title,
      description,
      file_data: this.compress(file_data),
      image_data: this.compress(image_data),
    });
    return this.repo.save(result);
  }

  async findByClassAndDep(classId: string, depId: string) {
    const list = await this.repo.find({
      where: { class_id: classId, dep_id: depId },
      order: { created_at: 'DESC' },
    });
    return list.map(r => {
      r.file_data = this.decompress(r.file_data);
      r.image_data = this.decompress(r.image_data);
      return r;
    });
  }
}