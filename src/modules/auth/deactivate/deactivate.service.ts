import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { hash, verify } from 'argon2'
import { Request } from 'express'

import { PrismaService } from '@/core/prisma/prisma.service'
import { TokenType, User } from '@/generated/prisma'
import { MailService } from '@/modules/libs/mail/mail.service'
import { generateToken } from '@/shared/utils/generate-token.util'
import { destroySession } from '@/shared/utils/session.util'
import { getSessionMetadata } from '@/shared/utils/sesstion-metadta.util'

import { DeactivateAccountInput } from './inputs/deactivate-account.input'

@Injectable()
export class DeactivateService {
	public constructor(
		private readonly configService: ConfigService,
		private readonly mailService: MailService,
		private readonly prismaService: PrismaService
	) {}

	public async validateDeactivateToken(req: Request, token: string) {
		const findExistingToken = await this.prismaService.token.findUnique({
			where: {
				token,
				type: TokenType.DEACTIVATE_ACCOUNT
			}
		})

		if (!findExistingToken) throw new NotFoundException('Токен не найден')

		const hasExpired = new Date(findExistingToken.expiresIn) < new Date()

		if (hasExpired) throw new BadRequestException('Токен истек')

		await this.prismaService.user.update({
			where: {
				id: findExistingToken.id
			},
			data: {
				isDeactivated: true,
				deactivatedAt: new Date()
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: findExistingToken.id,
				type: TokenType.DEACTIVATE_ACCOUNT
			}
		})

		return destroySession(req, this.configService)
	}

	public async sendDeactivateToken(
		req: Request,
		user: User,
		userAgent: string
	) {
		const deactivateToken = await generateToken(
			this.prismaService,
			user,
			TokenType.DEACTIVATE_ACCOUNT,
			false
		)

		const metaData = getSessionMetadata(req, userAgent)

		await this.mailService.sendDeactivateToken(
			user.email,
			deactivateToken.token,
			metaData
		)

		return true
	}

	public async deactivate(
		req: Request,
		userAgent: string,
		user: User,
		input: DeactivateAccountInput
	) {
		const { email, password, pin } = input
		if (user.email !== email)
			throw new BadRequestException('Неверная почта')

		const isValidPassword = verify(user.password, password)
		if (!isValidPassword) throw new BadRequestException('Неверный пароль')

		if (!pin) {
			await this.sendDeactivateToken(req, user, userAgent)

			return { message: 'Требуется код подтверждения' }
		}

		await this.validateDeactivateToken(req, pin)

		return { user }
	}
}
