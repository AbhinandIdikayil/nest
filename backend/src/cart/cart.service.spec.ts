import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { Cart } from '../common/entity/cart.entity';
import { LineItem } from '../common/entity/line-item.entity';
import { CartDbService } from './cart.db.service';

describe('CartService', () => {
  let service: CartService;
  const repositoryMock = {
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const cartDbServiceMock = {
    addItemToCart: jest.fn(),
    getCartByCustomerId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: getRepositoryToken(Cart),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(LineItem),
          useValue: repositoryMock,
        },
        {
          provide: CartDbService,
          useValue: cartDbServiceMock,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
