import { Injectable, Logger } from '@nestjs/common';
import { Connection, createConnection } from 'mysql2/promise';

@Injectable()
export class DatabaseService {
  private connection: Connection;

  private readonly logger = new Logger(DatabaseService.name);

  constructor() {
    this.connect();
  }

  private async connect() {
    try {
      this.connection = await createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'blog_post_manager_db',
      });
      this.logger.log('Connected to MySQL database');
    } catch (error) {
      this.logger.error('Error connecting to MySQL database', error.stack);
    }
  }

  getConnection(): Connection {
    return this.connection;
  }
}
