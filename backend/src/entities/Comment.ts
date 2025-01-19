import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Dream } from './Dream';
import { User } from './User';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.dreams)
  user: User;

  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => Dream, dream => dream.comments)
  dream: Dream;

  @Column({ type: 'varchar' })
  dreamId: string;
}
