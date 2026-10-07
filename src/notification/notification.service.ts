import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(@InjectRepository(Notification) private repo: Repository<Notification>) {}

  create(userId: string, type: string, message: string) {
    return this.repo.save(this.repo.create({
      user: { id: userId } as any,
      type,
      message,
    }));
  }

  async findByUser(userId: string) {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  async countUnread(userId: string) {
    return this.repo.count({
      where: { user: { id: userId }, is_read: false },
    });
  }

  async markAllRead(userId: string) {
    await this.repo.update({ user: { id: userId }, is_read: false }, { is_read: true });
    return true;
  }
}