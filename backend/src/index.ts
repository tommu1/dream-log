import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import 'reflect-metadata';
import { AppDataSource } from './config/database';
import auth from './routes/auth';
import dreams from './routes/dreams';
import tags from './routes/tags';
import users from './routes/users';

const app = new Hono();

// CORSの設定
app.use('/*', cors());

// ルートの設定
app.route('/auth', auth);
app.route('/dreams', dreams);
app.route('/users', users);
app.route('/tags', tags);

// ヘルスチェック
app.get('/', c => c.json({ status: 'ok' }));

// データベース接続とサーバー起動
const start = async () => {
  try {
    await AppDataSource.initialize();
    console.log('データベースに接続しました');

    serve(
      {
        fetch: app.fetch,
        port: 3001
      },
      () => {
        console.log('サーバーが起動しました - http://localhost:3001');
      }
    );
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
};

start();
