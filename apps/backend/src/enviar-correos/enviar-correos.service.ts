import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';

interface IEmail {
  correo: string;
  token: string;
}
@Injectable()
export class EnviarCorreosService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('SMTP_HOST'),
      port: configService.get('SMTP_PORT'),
      auth: {
        user: configService.get('SMTP_USER'),
        pass: configService.get('SMTP_PASS'),
      },
    });
  }
  enviarConfirmacion = async (user: IEmail) => {
    const info = await this.transporter.sendMail({
      from: 'correosdemexico@unipolidgo.edu.mx',
      to: user.correo,
      subject: 'Confirma tu cuenta',
      text: 'Confirma tu cuenta',
      html: `Has creado una cuenta confirmala y tu token es ${user.token}`,
    });
    console.log('Mensaje enviado');
  };
}
