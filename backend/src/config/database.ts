import { DataSource } from 'typeorm';
import { Comment } from '../entities/Comment';
import { Dream } from '../entities/Dream';
import { Follow } from '../entities/Follow';
import { Like } from '../entities/Like';
import { Tag } from '../entities/Tag';
import { User } from '../entities/User';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'dream_log',
  password: process.env.DB_PASSWORD || 'dream_log',
  database: process.env.DB_DATABASE || 'dream_log',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
  entities: [User, Dream, Tag, Like, Comment, Follow],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
  charset: 'utf8mb4'
});
