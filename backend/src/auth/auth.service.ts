import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDbService } from './auth.db.service';
import { SigninDto } from './dto/signin.dto';
import { CreateCustomerDto } from './dto/create-auth.dto';
import { Customer } from 'src/common/entity/customer.entity';
import { Environments } from 'src/common/environments/environments.service';
import { JwtPayload } from './types/jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly authDbService: AuthDbService,
    private readonly jwtService: JwtService,
  ) {}

  async signupUser(createCustomerDto: CreateCustomerDto) {
    const existingCustomer = await this.authDbService.getUserByEmail(
      createCustomerDto.email,
    );

    if (existingCustomer) {
      throw new ConflictException('Customer already exists with this email');
    }

    const customer = await this.authDbService.createUser(createCustomerDto);
    return this.buildAuthResponse(customer);
  }

  async signinCustomer(data: SigninDto) {
    if (!data?.email) {
      throw new BadRequestException('Email is required');
    }

    const customer = await this.authDbService.getUserByEmail(data.email);

    if (!customer) {
      throw new NotFoundException('Email not found');
    }

    return this.buildAuthResponse(customer);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  private async buildAuthResponse(customer: Customer) {
    const payload: JwtPayload = {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      phone: customer.phone,
      lastName: customer.lastName,
    };

    return {
      customer,
      accessToken: await this.jwtService.signAsync(payload, {
        secret: Environments.get('JWT_SECRET'),
        expiresIn: '15m',
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: Environments.get('JWT_SECRET'),
        expiresIn: '7d',
      }),
    };
  }
}
