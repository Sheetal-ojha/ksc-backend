import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Notification } from './notification.entity';
import { NotificationService } from './notification.service';
import { Public } from '../auth/decorators/public.decorator';
import { Int } from '@nestjs/graphql';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private service: NotificationService) {}

  @Public()
  @Query(() => [Notification])
  notifications(@Args('userId', { type: () => ID }) userId: string) {
    return this.service.findByUser(userId);
  }

  @Public()
  @Query(() => Int)
  unreadCount(@Args('userId', { type: () => ID }) userId: string) {
    return this.service.countUnread(userId);
  }

  @Public()
  @Mutation(() => Boolean)
  markNotificationsRead(@Args('userId', { type: () => ID }) userId: string) {
    return this.service.markAllRead(userId);
  }
}