import { join } from 'path';
import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Environments } from '../environments/environments.service';

Environments.validate();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: Environments.get('POSTGRES_HOST'),
  port: Environments.getNumber('POSTGRES_PORT'),
  username: Environments.get('POSTGRES_USER'),
  password: Environments.get('POSTGRES_PASS'),
  database: Environments.get('POSTGRES_DB'),
  entities: [join(__dirname, '..', '..', '**', '*.entity.{js,ts}')],
  migrations: [join(__dirname, '..', 'migrations', '*.{js,ts}')],
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
});
