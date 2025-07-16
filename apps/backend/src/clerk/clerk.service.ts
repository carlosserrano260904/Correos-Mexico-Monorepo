import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccount } from '../create-account/entities/create-account.entity';

@Injectable()
export class ClerkService {
  private readonly clerkSecretKey = process.env.CLERK_SECRET_KEY;

  constructor(
    @InjectRepository(CreateAccount)
    private readonly createAccountRepository: Repository<CreateAccount>,
  ) {}

  async deleteUser(userId: string): Promise<void> {
    const { data: clerkUser } = await axios.get(
      `https://api.clerk.com/v1/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${this.clerkSecretKey}`,
        },
      },
    );

    const email = clerkUser.email_addresses?.[0]?.email_address;

    if (!email) {
      throw new Error('No se pudo obtener el correo del usuario en Clerk');
    }

    await axios.delete(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${this.clerkSecretKey}`,
      },
    });

    await this.createAccountRepository.delete({ correo: email });
  }
}