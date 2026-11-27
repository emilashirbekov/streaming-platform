import { Injectable, NotFoundException } from '@nestjs/common'

import { PrismaService } from '@/core/prisma/prisma.service'

@Injectable()
export class CategoryService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async findAll() {
		const categories = await this.prismaService.category.findMany({
			orderBy: {
				createdAt: 'desc'
			}
		})

		return categories
	}

	public async findRandom() {
		const total = await this.prismaService.category.count()

		const randomIndexses = new Set<number>()

		while (randomIndexses.size < 4) {
			const randomIndex = Math.floor(Math.random() * total)
			randomIndexses.add(randomIndex)
		}

		const categories = await this.prismaService.category.findMany({
			take: total,
			skip: 0
		})

		return Array.from(randomIndexses).map(index => categories[index])
	}

	public async findCategory(slug: string) {
		const category = await this.prismaService.category.findUnique({
			where: {
				slug
			},
			include: {
				streams: {
					include: {
						user: true,
						category: true
					}
				}
			}
		})

		if (!category) throw new NotFoundException('Категория не найдена')

		return category
	}
}
