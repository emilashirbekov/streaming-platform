import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AccessToken } from 'livekit-server-sdk'
import sharp from 'sharp'

import { PrismaService } from '@/core/prisma/prisma.service'
import { Prisma, User } from '@/generated/prisma'

import type { GraphQLFileUpload } from '../auth/profile/types/graphql-file-upload.type'
import { StorageService } from '../libs/mail/storage/storage.service'

import { ChangeStreamInfoInput } from './inputs/change-stream-info.input'
import { FilterInput } from './inputs/filter.inputs'
import { GenerateStreamToken } from './inputs/generate-stream-token.input'

@Injectable()
export class StreamService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly storageService: StorageService,
		private readonly configService: ConfigService
	) {}

	public async findAll(input: FilterInput) {
		const { take, skip, searchTerm } = input

		const whereClause = searchTerm
			? this.findBySearchTerm(searchTerm)
			: undefined

		const streams = await this.prismaService.stream.findMany({
			take: take ?? 12,
			skip: skip ?? 0,
			where: {
				user: {
					isDeactivated: false
				},
				...whereClause
			},
			include: {
				user: true,
				category: true
			},
			orderBy: {
				createdAt: 'desc'
			}
		})

		return streams
	}

	public async findRandom() {
		const total = await this.prismaService.stream.count({
			where: {
				user: {
					isDeactivated: false
				}
			}
		})

		const randomIndexses = new Set<number>()

		while (randomIndexses.size < 4) {
			const randomIndex = Math.floor(Math.random() * total)
			randomIndexses.add(randomIndex)
		}

		const streams = await this.prismaService.stream.findMany({
			where: {
				user: {
					isDeactivated: false
				}
			},

			include: { user: true, category: true },
			take: total,
			skip: 0
		})

		return Array.from(randomIndexses).map(index => streams[index])
	}

	public async changeStreamInfo(user: User, input: ChangeStreamInfoInput) {
		const { title, categoryId } = input

		await this.prismaService.stream.update({
			where: {
				userId: user.id
			},
			data: {
				title,
				category: {
					connect: {
						id: categoryId
					}
				}
			}
		})

		return true
	}

	public async removeAvatar(user: User) {
		if (!user.avatar) return

		await this.storageService.remove(user.avatar)

		await this.prismaService.user.update({
			where: {
				id: user.id
			},
			data: {
				avatar: null
			}
		})

		return true
	}

	public async changeStreamThumbnail(user: User, file: GraphQLFileUpload) {
		const stream = await this.findByUserId(user)

		if (stream.thumbnailUrl) {
			await this.storageService.remove(stream.thumbnailUrl)
		}

		const chunks: Buffer[] = []

		for await (const chunk of file.createReadStream()) {
			chunks.push(chunk)
		}

		const buffer = Buffer.concat(chunks)
		const fileName = `/streams/${user.username}.webp`

		if (file.filename && file.filename.endsWith('.gif')) {
			const processedBuffer = await sharp(buffer, { animated: true })
				.resize(1280, 720)
				.webp()
				.toBuffer()

			await this.storageService.upload(
				processedBuffer,
				fileName,
				'image/webp'
			)
		} else {
			const processedBuffer = await sharp(buffer)
				.resize(1280, 720)
				.webp()
				.toBuffer()

			await this.storageService.upload(
				processedBuffer,
				fileName,
				'image/webp'
			)
		}

		await this.prismaService.stream.update({
			where: {
				userId: user.id
			},
			data: {
				thumbnailUrl: fileName
			}
		})

		return true
	}

	public async removeThumbnail(user: User) {
		const stream = await this.findByUserId(user)

		if (!stream.thumbnailUrl) return

		await this.storageService.remove(stream.thumbnailUrl)

		await this.prismaService.stream.update({
			where: {
				userId: user.id
			},
			data: {
				thumbnailUrl: null
			}
		})

		return true
	}

	public async generateStreamToken(input: GenerateStreamToken) {
		const { userId, channelId } = input

		let self: { id: string; username: string }

		const user = await this.prismaService.user.findUnique({
			where: {
				id: userId
			}
		})

		if (user) {
			self = { id: userId, username: (await user).username }
		} else {
			self = {
				id: userId,
				username: `Зритель ${Math.floor(Math.random() * 100000)}`
			}
		}

		const channel = await this.prismaService.user.findUnique({
			where: {
				id: channelId
			}
		})

		if (!channel) throw new NotFoundException('Канал не найден')

		const isHost = self.id === channelId

		const token = new AccessToken(
			this.configService.getOrThrow<string>('LIVE_KIT_API_KEY'),
			this.configService.getOrThrow<string>('LIVE_KIT_API_SECRET'),
			{ identity: isHost ? `Host-${self.id}` : self.id.toString() }
		)

		token.addGrant({
			room: channel.id,
			roomJoin: true,
			canPublish: false
		})

		return { token: token.toJwt() }
	}

	private async findByUserId(user: User) {
		const stream = await this.prismaService.stream.findUnique({
			where: {
				userId: user.id
			}
		})

		return stream
	}

	private findBySearchTerm(searchTerm: string): Prisma.StreamWhereInput {
		return {
			OR: [
				{
					title: {
						contains: searchTerm,
						mode: 'insensitive'
					},
					user: {
						username: {
							contains: searchTerm,
							mode: 'insensitive'
						}
					}
				}
			]
		}
	}
}
