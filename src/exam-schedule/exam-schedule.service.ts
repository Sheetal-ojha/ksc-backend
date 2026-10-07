import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExamSchedule } from './exam-schedule.entity';
import { huffmanCompress, huffmanDecompress } from '../common/huffman.util';

@Injectable()
export class ExamScheduleService {
  constructor(@InjectRepository(ExamSchedule) private repo: Repository<ExamSchedule>) {}

  private compress(data?: string) {
    if (!data) return undefined;
    return huffmanCompress(Buffer.from(data, 'base64'));
  }

  private decompress(data?: string) {
    if (!data) return undefined;
    return huffmanDecompress(data).toString('base64');
  }

  async create(teacherId: string, title: string, description?: string, file_data?: string, image_data?: string, exam_date?: string) {
    return this.repo.save(this.repo.create({
      teacher: { id: teacherId } as any,
      title,
      description,
      file_data: this.compress(file_data),
      image_data: this.compress(image_data),
      exam_date,
    }));
  }

  async findAll() {
    const list = await this.repo.find({ order: { created_at: 'DESC' } });
    return list.map(e => {
      e.file_data = this.decompress(e.file_data);
      e.image_data = this.decompress(e.image_data);
      return e;
    });
  }
}