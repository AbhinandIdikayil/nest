import { Module } from '@nestjs/common';
import 'reflect-metadata';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Environments } from '../environments/environments.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: Environments.get('POSTGRES_HOST'),
      port: Environments.getNumber('POSTGRES_PORT'),
      username: Environments.get('POSTGRES_USER'),
      password: Environments.get('POSTGRES_PASS'),
      database: Environments.get('POSTGRES_DB'),
      entities: [join(__dirname, '..', '..', '**', '*.entity.{js,ts}')],
      migrations: [join(__dirname, '..', 'migrations', '*.{js,ts}')],
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy(),
    }),
  ],
})
export class PostgresModule {}
