import { forwardRef, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from 'modules/users';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get<string>('SMTP_HOST'),
                    secure: false,
                    auth: {
                        user: config.get<string>('SMTP_USER'),
                        pass: config.get<string>('SMTP_PASSWORD'),
                    },
                },
                defaults: {
                    from: `"Telegram"- ${config.get<string>('SMTP_USER')}`,
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    // template: "confirmation",
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
        UsersModule
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }