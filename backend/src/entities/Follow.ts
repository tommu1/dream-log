import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity('follows')
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.following)
  follower: User;

  @Column({ type: 'varchar' })
  followerId: string;

  @ManyToOne(() => User, user => user.followers)
  following: User;

  @Column({ type: 'varchar' })
  followingId: string;

  @CreateDateColumn()
  createdAt: Date;
}
