import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';

interface IEmail {
  correo: string;
  token?: string;
  nombre?: string;
}

@Injectable()
export class EnviarCorreosService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async enviarConfirmacion(user: IEmail): Promise<void> {
    const mailOptions = {
      from: '"Correos México" <correosdemexicoclic@gmail.com>',
      to: user.correo,
      subject: 'Confirma tu cuenta - Correos México',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>¡Bienvenido ${user.nombre || ''}!</h2>
          <p>Tu código de verificación es:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px;">
            ${user.token}
          </div>
          <p>Este código expirará en 10 minutos.</p>
          <p>Si no solicitaste este código, puedes ignorar este email.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
    console.log('Email de confirmación enviado a:', user.correo);
  }

  async enviarAdvertenciaEliminacion(user: IEmail): Promise<void> {
    const mailOptions = {
      from: '"Correos México" <correosdemexicoclic@gmail.com>',
      to: user.correo,
      subject: 'Tu cuenta será eliminada pronto',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Hola ${user.nombre || 'usuario'},</h2>
          <p>Tu cuenta en Correos México será eliminada en las próximas 4 horas por falta de verificación.</p>
          <p>Por favor verifica tu cuenta usando el código que recibiste anteriormente.</p>
          <p>Si ya verificaste tu cuenta, puedes ignorar este mensaje.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
    console.log('Email de advertencia enviado a:', user.correo);
  }

  async enviarTestEmail(): Promise<string> {
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await testTransporter.sendMail({
      from: '"Test Email" <test@example.com>',
      to: 'test@example.com',
      subject: 'Test Email',
      text: 'This is a test email',
    });

    return nodemailer.getTestMessageUrl(info);
  }
}
