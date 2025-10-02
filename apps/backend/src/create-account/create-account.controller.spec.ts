import { Test, TestingModule } from '@nestjs/testing';
import { CreateAccountController } from './create-account.controller';
import { CreateAccountService } from './create-account.service';

describe('CreateAccountController', () => {
  let controller: CreateAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateAccountController],
      providers: [CreateAccountService],
    }).compile();

    controller = module.get<CreateAccountController>(CreateAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
