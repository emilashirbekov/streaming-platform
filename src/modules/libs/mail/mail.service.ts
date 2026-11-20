import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { render } from 'react-email'

import type { SessionMetadata } from '@/shared/types/session.metadata.type'

import { DeactivateTemplate } from './templates/deactivate.template'
import { PasswordRecoveryTemplate } from './templates/password-recovery.template'
import { VerificationTemplate } from './templates/verification.template'

@Injectable()
export class MailService {
	public constructor(
		private readonly mailService: MailerService,
		private readonly configService: ConfigService
	) {}

	public async sendVerificationToken(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')

		const html = await render(VerificationTemplate({ domain, token }))

		return this.sendMail(email, 'Верификация аккаунта', html)
	}

	public async sendPasswordResetToken(
		email: string,
		token: string,
		metaData: SessionMetadata
	) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN')

		const html = await render(
			PasswordRecoveryTemplate({ domain, token, metaData })
		)

		return this.sendMail(email, 'Сброс пароля', html)
	}

	public async sendDeactivateToken(
		email: string,
		token: string,
		metaData: SessionMetadata
	) {
		const html = await render(DeactivateTemplate({ token, metaData }))

		return this.sendMail(email, 'Деактивация аккаунта', html)
	}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailService.sendMail({
			to: email,
			subject,
			html
		})
	}
}
