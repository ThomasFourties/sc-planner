import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

// console log les variables d'environnement
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);
console.log(process.env.EMAIL_HOST);
console.log(process.env.EMAIL_PORT);
console.log(process.env.EMAIL_FROM);
console.log(process.env.FRONTEND_URL);

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);
  private isConfigured = false;

  constructor(private configService: ConfigService) {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPass = this.configService.get<string>('EMAIL_PASS');

    if (emailUser && emailPass) {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('EMAIL_HOST') || 'smtp.gmail.com',
        port: this.configService.get<number>('EMAIL_PORT') || 587,
        secure: this.configService.get<boolean>('EMAIL_SECURE') || this.configService.get<number>('EMAIL_PORT') === 465,
        auth: {
          user: emailUser,
          pass: emailPass,
        },
        tls: {
          rejectUnauthorized: false, // Pour IONOS
        },
        connectionTimeout: 60000, // 60 secondes
        greetingTimeout: 30000, // 30 secondes
        socketTimeout: 60000, // 60 secondes
      });
      this.isConfigured = true;
      this.logger.log('Service email configuré avec succès');
    } else {
      this.logger.warn(
        "Configuration SMTP manquante. Les emails seront loggés au lieu d'être envoyés.",
      );
      this.logger.warn(
        'Configurez EMAIL_USER et EMAIL_PASS dans votre fichier .env',
      );
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}`;

    const emailContent = {
      from: 'SC Planner <noreply@sc-planner.thomasfourties.fr>',
      to: email,
      subject: 'Réinitialisation de votre mot de passe - SC Planner',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Réinitialisation de mot de passe</h2>
          <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
          <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p>Ce lien expire dans 1 heure.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        </div>
      `,
    };

    if (this.isConfigured) {
      try {
        await this.transporter.sendMail(emailContent);
        this.logger.log(`Email de réinitialisation envoyé à: ${email}`);
      } catch (error) {
        this.logger.error(
          `Erreur lors de l'envoi de l'email de réinitialisation à ${email}:`,
          error,
        );
        this.logger.warn(
          `[DÉVELOPPEMENT] Lien de réinitialisation pour ${email}: ${resetUrl}`,
        );
      }
    } else {
      this.logger.log(
        `[DÉVELOPPEMENT] Email de réinitialisation à envoyer à: ${email}`,
      );
      this.logger.log(`[DÉVELOPPEMENT] Lien de réinitialisation: ${resetUrl}`);
    }
  }
}
