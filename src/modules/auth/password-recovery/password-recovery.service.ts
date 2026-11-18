import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { hash } from 'argon2'
import { Request } from 'express'

import { PrismaService } from '@/core/prisma/prisma.service'
import { TokenType } from '@/generated/prisma'
import { MailService } from '@/modules/libs/mail/mail.service'
import { generateToken } from '@/shared/utils/generate-token.util'
import { getSessionMetadata } from '@/shared/utils/sesstion-metadta.util'

import { NewPasswordInput } from './inputs/new-password.input'
import { ResetPasswordInput } from './inputs/reset-password.input'

@Injectable()
export class PasswordRecoveryService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	public async resetPassword(
		req: Request,
		input: ResetPasswordInput,
		userAgent: string
	) {
		const { email } = input

		const user = await this.prismaService.user.findUnique({
			where: {
				email
			}
		})

		if (!user) throw new NotFoundException('Пользователь не найден')

		const resetToken = await generateToken(
			this.prismaService,
			user,
			TokenType.PASSWORD_RESET,
			true
		)

		const metaData = getSessionMetadata(req, userAgent)

		await this.mailService.sendPasswordResetToken(
			user.email,
			resetToken.token,
			metaData
		)

		return true
	}

	public async newPassword(input: NewPasswordInput) {
		const { password, token } = input

		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.PASSWORD_RESET
			}
		})

		if (!existingToken) throw new NotFoundException('Токен не найден')

		const hasExpired = new Date(existingToken.expiresIn) < new Date()

		if (hasExpired) throw new BadRequestException('Токен истек')
		if (!existingToken.userId)
			throw new NotFoundException('Токен не привязан к пользователю')

		await this.prismaService.user.update({
			where: {
				id: existingToken.userId
			},
			data: {
				password: await hash(password)
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.PASSWORD_RESET
			}
		})

		return true
	}
}
