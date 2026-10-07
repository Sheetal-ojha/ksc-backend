import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback, FeedbackRating } from './feedback.entity';
import { UserEntity } from '../auth/users/user.entity';
import { Role } from '../auth/role.enum';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback) private repo: Repository<Feedback>,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async giveFeedback(teacherId: string, submissionId: string, rating: FeedbackRating, comment?: string) {
    const teacher = await this.userRepo.findOneBy({ id: teacherId });
    if (!teacher || teacher.role !== Role.TEACHER) throw new ForbiddenException('Only teachers can give feedback');
    const existing = await this.repo.findOne({ where: { submission: { id: submissionId }, teacher: { id: teacherId } } });
    if (existing) {
      existing.rating = rating;
      if (comment !== undefined) existing.comment = comment;
      return this.repo.save(existing);
    }
    return this.repo.save(this.repo.create({
      teacher: { id: teacherId } as any,
      submission: { id: submissionId } as any,
      rating,
      comment,
    }));
  }

  findBySubmission(submissionId: string) {
    return this.repo.findOne({
      where: { submission: { id: submissionId } },
    });
  }
}