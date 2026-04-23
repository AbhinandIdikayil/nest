import {
  Controller,
  Get,
  Header,
  Post,
  Patch,
  Param,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import type { CustomerSession } from 'src/auth/types/jwt.payload';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { CustomerGuard } from '../common/guards/customer.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-item')
  @UseGuards(CustomerGuard)
  async addItem(
    @CurrentUser() customerSession: CustomerSession,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return await this.cartService.addItem(customerSession.id, addToCartDto);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Get('record/:id')
  findByCartId(@Param('id') id: string) {
    return this.cartService.findByCartId(id);
  }

  @Get(':id')
  @Header('Content-Type', 'text/html; charset=utf-8')
  renderCheckoutPage(@Param('id') id: string) {
    return this.cartService.getCheckoutPage(id);
  }

  @Get('customer/:id')
  async getCartByCustomerId(@Param('id') id: string) {
    return await this.cartService.getCartByCustomerId(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: { customerId?: string; completedAt?: Date },
  ) {
    return this.cartService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(id);
  }
}
