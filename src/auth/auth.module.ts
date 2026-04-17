import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthDbService } from './auth.db.service';
import { Customer } from 'src/common/entity/customer.entity';
import { Environments } from 'src/common/environments/environments.service';

@Module({
  imports: [
    JwtModule.register({ secret: Environments.get('JWT_SECRET') }),
    TypeOrmModule.forFeature([Customer]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthDbService],
})
export class AuthModule {}
