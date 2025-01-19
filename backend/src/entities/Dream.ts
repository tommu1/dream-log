import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Comment } from './Comment';
import { Like } from './Like';
import { Tag } from './Tag';
import { User } from './User';

@Entity('dreams')
export class Dream {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'boolean', default: true })
  isPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.dreams)
  user: User;

  @Column({ type: 'varchar' })
  userId: string;

  @ManyToMany(() => Tag, tag => tag.dreams)
  @JoinTable({
    name: 'dream_tags',
    joinColumn: {
      name: 'dreamId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id'
    }
  })
  tags: Tag[];

  @OneToMany(() => Like, like => like.dream)
  likes: Like[];

  @OneToMany(() => Comment, comment => comment.dream)
  comments: Comment[];
}
