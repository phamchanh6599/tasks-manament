import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailsService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Create a transporter
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  /**
   * Send an email verification link
   */
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.configService.get<string>('APP_URL')}/auth/verify-email?token=${token}`;

    const templatePath = path.join(
      process.cwd(),
      'src',
      'mails',
      'templates',
      'verification-email.hbs',
    );
    const template = fs.readFileSync(templatePath, 'utf8');
    const compiledTemplate = handlebars.compile(template);

    const html = compiledTemplate({
      verificationUrl,
      appName: this.configService.get<string>(
        'APP_NAME',
        'Task Management App',
      ),
    });

    await this.transporter.sendMail({
      from: `"${this.configService.get<string>('MAIL_FROM_NAME')}" <${this.configService.get<string>('MAIL_FROM_ADDRESS')}>`,
      to: email,
      subject: 'Verify your email address',
      html,
    });
  }
}
