import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserEntity } from '../auth/users/user.entity';

@ObjectType()
@Entity('results')
export class Result {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  title!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text' })
  file_data?: string;

  @Field({ nullable: true })
  @Column({ nullable: true, type: 'text' })
  image_data?: string;

  @Field()
  @Column()
  class_id!: string;

  @Field()
  @Column()
  dep_id!: string;

  @Field()
  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacher_id' })
  teacher!: UserEntity;
}