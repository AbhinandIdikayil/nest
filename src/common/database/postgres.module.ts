
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: ['src/common/entity/*.entity.ts'],
      migrations: ['src/common/migrations/*.ts'],
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy()
    }),
  ],
})
export class AppModule { }
