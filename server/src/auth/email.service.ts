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

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    const emailContent = {
      from:
        this.configService.get<string>('EMAIL_FROM') ||
        'noreply@sc-planner.com',
      to: email,
      subject: 'Vérification de votre compte SC Planner',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Bienvenue sur SC Planner !</h2>
          <p>Merci de vous être inscrit. Pour activer votre compte, veuillez utiliser le code de vérification suivant :</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="font-size: 36px; color: #007bff; margin: 0;">${code}</h1>
          </div>
          <p>Ce code expire dans 24 heures.</p>
          <p>Si vous n'avez pas créé de compte, ignorez cet email.</p>
        </div>
      `,
    };

    if (this.isConfigured) {
      try {
        await this.transporter.sendMail(emailContent);
        this.logger.log(`Email de vérification envoyé à: ${email}`);
      } catch (error) {
        this.logger.error(
          `Erreur lors de l'envoi de l'email de vérification à ${email}:`,
          error,
        );
        this.logger.warn(
          `[DÉVELOPPEMENT] Code de vérification pour ${email}: ${code}`,
        );
        this.logger.warn(
          "L'inscription continue malgré l'erreur d'envoi d'email",
        );
        // Ne pas lancer d'erreur, permettre à l'inscription de continuer
      }
    } else {
      this.logger.log(
        `[DÉVELOPPEMENT] Email de vérification à envoyer à: ${email}`,
      );
      this.logger.log(`[DÉVELOPPEMENT] Code de vérification: ${code}`);
    }
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${token}`;

    const emailContent = {
      from:
        this.configService.get<string>('EMAIL_FROM') ||
        'noreply@sc-planner.com',
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
        // Ne pas lancer d'erreur, permettre à la réinitialisation de continuer
      }
    } else {
      this.logger.log(
        `[DÉVELOPPEMENT] Email de réinitialisation à envoyer à: ${email}`,
      );
      this.logger.log(`[DÉVELOPPEMENT] Lien de réinitialisation: ${resetUrl}`);
    }
  }
}
