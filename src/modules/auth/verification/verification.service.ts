import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import type { Request } from 'express'

import { PrismaService } from '@/core/prisma/prisma.service'
import { TokenType, User } from '@/generated/prisma'
import { MailService } from '@/modules/libs/mail/mail.service'
import { generateToken } from '@/shared/utils/generate-token.util'
import { saveSession } from '@/shared/utils/session.util'
import { getSessionMetadata } from '@/shared/utils/sesstion-metadta.util'

import { VerificationInput } from './inputs/verification.input'

@Injectable()
export class VerificationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	public async verify(
		req: Request,
		input: VerificationInput,
		userAgent: string
	) {
		const { token } = input
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.EMAIL_VERIFY
			}
		})

		if (!existingToken) throw new NotFoundException('Токен не найден')

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) throw new BadRequestException('Токен истек')
		if (!existingToken.userId)
			throw new NotFoundException('Токен не привязан к пользователю')

		const user = await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				isEmailVerified: true
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.EMAIL_VERIFY
			}
		})

		const metaData = getSessionMetadata(req, userAgent)

		return saveSession(req, user, metaData)
	}

	public async sendVerificationToken(user: User) {
		const verificationToken = await generateToken(
			this.prismaService,
			user,
			TokenType.EMAIL_VERIFY,
			true
		)

		await this.mailService.sendVerificationToken(
			user.email,
			verificationToken.token
		)

		return true
	}
}
