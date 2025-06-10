import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login/login.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginAccountService: LoginService) {}
  @Post()
  create(@Body() loginAccountService: LoginDto) {
    return this.loginAccountService.login(loginAccountService);
  }
}
