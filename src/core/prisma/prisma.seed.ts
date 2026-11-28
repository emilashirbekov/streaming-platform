import { BadRequestException, Logger } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'
import { hash } from 'argon2'

import { Prisma, PrismaClient } from '../../generated/prisma/client'

dotenv.config()

const prisma = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: process.env.POSTGRES_URI
	}),
	transactionOptions: {
		maxWait: 5000,
		timeout: 10000,
		isolationLevel: Prisma.TransactionIsolationLevel.Serializable
	}
})

async function main() {
	try {
		Logger.log('Начало заполнения базы данных')

		await prisma.$transaction([
			prisma.user.deleteMany(),
			prisma.socialLink.deleteMany(),
			prisma.stream.deleteMany(),
			prisma.category.deleteMany()
		])

		const categoriesData = [
			{
				title: 'Игры',
				slug: 'gaming',
				description: 'Игровые стримы, прохождения и киберспорт.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
			},
			{
				title: 'Общение',
				slug: 'just-chatting',
				description:
					'Разговоры, ответы на вопросы и эфиры с аудиторией.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
			},
			{
				title: 'Музыка',
				slug: 'music',
				description:
					'Живые выступления, музыкальные сессии и диджей-сеты.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80'
			},
			{
				title: 'Искусство',
				slug: 'art',
				description:
					'Рисование, иллюстрация, дизайн и творческий процесс.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80'
			},
			{
				title: 'Образование',
				slug: 'education',
				description: 'Лекции, разборы тем и практические занятия.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80'
			},
			{
				title: 'Спорт',
				slug: 'sports',
				description:
					'Тренировки, спортивные события и обсуждение матчей.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80'
			},
			{
				title: 'Технологии',
				slug: 'technology',
				description: 'Программирование, гаджеты и новости технологий.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
			},
			{
				title: 'Кулинария',
				slug: 'cooking',
				description: 'Рецепты, приготовление блюд и кулинарные эфиры.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
			},
			{
				title: 'Путешествия',
				slug: 'travel',
				description:
					'Трансляции из разных городов, стран и интересных мест.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1488646963014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
			},
			{
				title: 'Наука',
				slug: 'science',
				description:
					'Научно-популярные темы, эксперименты и дискуссии.',
				thumbnailUrl:
					'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80'
			}
		]

		await prisma.category.createMany({ data: categoriesData })
		Logger.log('Категории успешно заполнены')

		const categories = await prisma.category.findMany()
		const categoryBySlug = Object.fromEntries(
			categories.map(category => [category.slug, category])
		)
		const streamTitles: Record<string, string[]> = {
			gaming: [
				'Прохожу Elden Ring без подсказок',
				'Рангед в Valorant — играем до победы',
				'Вечерний Minecraft: строим город',
				'Инди-игры, которые вы могли пропустить'
			],
			'just-chatting': [
				'Знакомимся и отвечаем на ваши вопросы',
				'Обсуждаем новости недели',
				'Чат выбирает тему для разговора',
				'Уютный вечерний разговор'
			],
			music: [
				'Пишу новый трек с нуля',
				'Живой акустический сет',
				'Диджей-сет: электронная музыка',
				'Разбираем ваши любимые песни'
			],
			art: [
				'Рисую персонажа по идеям из чата',
				'Цифровая иллюстрация: от наброска до цвета',
				'Создаём обложку для вымышленной игры',
				'Практика скетчинга в прямом эфире'
			],
			education: [
				'Английский разговорный клуб для начинающих',
				'Разбираем основы JavaScript на примерах',
				'Математика без страха: решаем задачи вместе',
				'Как эффективно планировать обучение'
			],
			sports: [
				'Домашняя тренировка без оборудования',
				'Готовимся к забегу на 5 километров',
				'Разбор тактики прошедшего матча',
				'Растяжка и восстановление после тренировки'
			],
			technology: [
				'Собираю приложение на React в прямом эфире',
				'Обзор полезных инструментов разработчика',
				'Настраиваем домашнюю лабораторию',
				'Новости технологий и обсуждение гаджетов'
			],
			cooking: [
				'Готовим домашнюю пасту с нуля',
				'Быстрые завтраки на всю неделю',
				'Печём яблочный пирог вместе с чатом',
				'Ужин из простых сезонных продуктов'
			],
			travel: [
				'Прогулка по старым улицам Бишкека',
				'Планируем самостоятельное путешествие',
				'Показываю любимые места моего города',
				'Маршрут выходного дня в горах'
			],
			science: [
				'Почему небо меняет цвет на закате?',
				'Разбираем последние открытия в космосе',
				'Простые опыты по физике дома',
				'Как устроен человеческий мозг'
			]
		}

		const usernames = [
			'pixelfox',
			'nightowlgg',
			'crafty_mira',
			'indie_rover',
			'coffee_with_anya',
			'urban_nomad',
			'chatty_max',
			'evening_vibes',
			'soundwave_lee',
			'acoustic_sam',
			'dj_nova',
			'vinyl_vika',
			'linebyline',
			'mira_draws',
			'canvas_fox',
			'sketch_ilya',
			'english_with_kit',
			'code_by_dan',
			'math_mate',
			'learn_with_lena',
			'fit_arman',
			'run_with_sara',
			'tactics_tim',
			'move_daily',
			'frontend_fox',
			'gadget_guru',
			'homelab_aziz',
			'tech_with_olga',
			'pasta_pavel',
			'breakfast_bella',
			'bake_with_ira',
			'homechef_roman',
			'bishkek_walks',
			'route_by_raya',
			'city_roamer',
			'mountain_days',
			'skywatcher_ali',
			'science_sonya',
			'curious_kir',
			'brainwaves_nina'
		]

		await prisma.$transaction(async tx => {
			for (const username of usernames) {
				const randomCateggory =
					categoryBySlug[
						Object.keys(categoryBySlug)[
							Math.floor(
								Math.random() *
									Object.keys(categoryBySlug).length
							)
						]
					]

				const user = await tx.user.findUnique({
					where: {
						username
					}
				})

				if (!user) {
					const createUser = await tx.user.create({
						data: {
							email: `${username}@teststream.ru`,
							password: await hash('12345678'),
							username,
							displayName: username,
							avatar: `/channels/${username}.webp`,
							isEmailVerified: true,
							socialLinks: {
								createMany: {
									data: [
										{
											title: 'Telegram',
											url: `https://t.me/${username}`,
											position: 1
										},
										{
											title: 'Youtube',
											url: `https://youtube.com/@${username}`,
											position: 2
										}
									]
								}
							}
						}
					})
					const randomTitles = streamTitles[randomCateggory.slug]
					const randomTitle =
						randomTitles[
							Math.floor(Math.random() * randomTitles.length)
						]

					await tx.stream.create({
						data: {
							title: `${randomTitle} — ${username}`,
							thumbnailUrl: `/streams/${createUser.username}.webp`,
							user: {
								connect: {
									id: createUser.id
								}
							},
							category: {
								connect: {
									id: randomCateggory.id
								}
							}
						}
					})

					Logger.log(
						`Пользователь ${createUser.username} и его стрим успешно создан`
					)
				}
			}
		})

		Logger.log('Заполнение базы данных заполнено успешно')
	} catch (error) {
		Logger.error(error)
		throw new BadRequestException('Ошбика при запоолнении базы данных')
	} finally {
		Logger.log('Закрытие соединенения базы данных')
		await prisma.$disconnect()
		Logger.log('Соединение с базой данных закрыто ')
	}
}

main()
