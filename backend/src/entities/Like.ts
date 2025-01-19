import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Dream } from './Dream';
import { User } from './User';

@Entity('likes')
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.dreams)
  user: User;

  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => Dream)
  dream: Dream;

  @Column({ type: 'varchar' })
  dreamId: string;

  @CreateDateColumn()
  createdAt: Date;
}
