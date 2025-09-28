import { Test, TestingModule } from '@nestjs/testing';
import { CreateAccountService } from './create-account.service';

describe('CreateAccountService', () => {
  let service: CreateAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateAccountService],
    }).compile();

    service = module.get<CreateAccountService>(CreateAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
