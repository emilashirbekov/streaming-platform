import type { SessionMetadata } from '@/shared/types/session.metadata.type'
import * as React from 'react'
import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text
} from 'react-email'

interface PasswordRecoveryTemplateProps {
	domain: string
	token: string
	username?: string
	metaData: SessionMetadata
}

export function PasswordRecoveryTemplate({
	domain,
	token,
	username,
	metaData
}: PasswordRecoveryTemplateProps) {
	const recoveryUrl = new URL('/account/password-recovery', domain)
	recoveryUrl.searchParams.set('token', token)

	const location = [metaData.location.city, metaData.location.country]
		.filter(Boolean)
		.join(', ')
	const device = [
		metaData.device.type,
		metaData.device.browser,
		metaData.device.os
	]
		.filter(Boolean)
		.join(' · ')

	return (
		<Html lang='ru'>
			<Head />
			<Preview>Восстановите пароль от Streaming Platform</Preview>
			<Tailwind>
				<Body className='m-0 bg-[#f1f4f9] px-4 py-9 font-sans'>
					<Container className='mx-auto w-full max-w-[560px]'>
						<Section className='mb-4 px-2'>
							<Text className='m-0 inline-block h-9 w-9 rounded-[10px] bg-[#635bff] text-center align-middle text-lg leading-9 font-bold text-white'>
								S
							</Text>
							<Text className='m-0 ml-2 inline-block align-middle text-xs font-bold tracking-[1.6px] text-[#202a3c]'>
								STREAMING PLATFORM
							</Text>
						</Section>

						<Section className='rounded-[18px] border border-solid border-[#e5eaf2] bg-white px-10 pt-10 pb-8'>
							<Text className='mt-0 mb-3 text-[11px] font-bold tracking-[1.8px] text-[#635bff]'>
								ВОССТАНОВЛЕНИЕ ДОСТУПА
							</Text>
							<Heading className='mt-0 mb-[18px] text-[30px] leading-[1.2] font-bold tracking-[-0.7px] text-[#182235]'>
								Создайте новый пароль
							</Heading>
							<Text className='mt-0 mb-2 text-base leading-6 font-semibold text-[#344158]'>
								{username
									? `Привет, ${username}!`
									: 'Здравствуйте!'}
							</Text>
							<Text className='m-0 text-[15px] leading-7 text-[#647087]'>
								Мы получили запрос на смену пароля для вашего
								аккаунта. Нажмите кнопку ниже, чтобы выбрать
								новый пароль и снова войти в свой профиль.
							</Text>

							<Section className='mt-7 mb-[22px]'>
								<Button
									href={recoveryUrl.toString()}
									className='inline-block rounded-[9px] bg-[#635bff] px-6 py-4 text-center text-[15px] leading-none font-bold text-white no-underline'
								>
									Сбросить пароль
								</Button>
							</Section>

							<Text className='mt-0 mb-2 text-xs leading-5 text-[#78849a]'>
								Ссылка действительна 5 минут. Если кнопка не
								работает, откройте ссылку:
							</Text>
							<Link
								href={recoveryUrl.toString()}
								className='break-all text-xs leading-5 text-[#5148e5] underline'
							>
								{recoveryUrl.toString()}
							</Link>

							<Section className='mt-7 rounded-xl bg-[#f6f7fb] px-5 py-4'>
								<Text className='mt-0 mb-3 text-[11px] font-bold tracking-[1.5px] text-[#647087]'>
									ДАННЫЕ ЗАПРОСА
								</Text>
								<Text className='m-0 text-[13px] leading-6 text-[#344158]'>
									Устройство:{' '}
									{device || 'Не удалось определить'}
								</Text>
								<Text className='m-0 text-[13px] leading-6 text-[#344158]'>
									Местоположение:{' '}
									{location || 'Не удалось определить'}
								</Text>
								<Text className='m-0 text-[13px] leading-6 text-[#344158]'>
									IP-адрес:{' '}
									{metaData.ip || 'Не удалось определить'}
								</Text>
							</Section>

							<Hr className='my-7 border-[#edf0f5]' />

							<Text className='m-0 text-xs leading-5 text-[#8a94a7]'>
								Если вы не запрашивали сброс пароля,
								проигнорируйте это письмо. Ваш текущий пароль
								останется без изменений.
							</Text>
						</Section>

						<Text className='mt-[18px] mb-0 text-center text-xs leading-5 text-[#98a2b3]'>
							Ваша следующая история начинается здесь.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
