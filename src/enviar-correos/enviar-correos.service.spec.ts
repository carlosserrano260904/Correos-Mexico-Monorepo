import { Test, TestingModule } from '@nestjs/testing';
import { EnviarCorreosService } from './enviar-correos.service';

describe('EnviarCorreosService', () => {
  let service: EnviarCorreosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnviarCorreosService],
    }).compile();

    service = module.get<EnviarCorreosService>(EnviarCorreosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
