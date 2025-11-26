import {
  Controller,
  Delete,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ClerkService } from './clerk.service';

@Controller('clerk')
export class ClerkController {
  constructor(private readonly clerkService: ClerkService) {}

  @Delete('delete-user/:userId')
  async deleteUser(@Param('userId') userId: string) {
    try {
      await this.clerkService.deleteUser(userId);
      return { message: 'Cuenta eliminada correctamente' };
    } catch (error) {
      console.error('Error al eliminar cuenta:', error.message);
      throw new HttpException(
        { message: 'Error al eliminar la cuenta' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
