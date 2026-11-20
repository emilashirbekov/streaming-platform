import * as React from 'react'
import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Tailwind,
	Text
} from 'react-email'

interface AccountDeletionTemplateProps {
	username?: string
}

export function AccountDeletionTemplate({
	username
}: AccountDeletionTemplateProps) {
	return (
		<Html lang='ru'>
			<Head />
			<Preview>Ваш аккаунт Streaming Platform удалён</Preview>
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
								СТАТУС АККАУНТА
							</Text>
							<Heading className='mt-0 mb-[18px] text-[30px] leading-[1.2] font-bold tracking-[-0.7px] text-[#182235]'>
								Аккаунт удалён
							</Heading>
							<Text className='mt-0 mb-2 text-base leading-6 font-semibold text-[#344158]'>
								{username
									? `Здравствуйте, ${username}!`
									: 'Здравствуйте!'}
							</Text>
							<Text className='m-0 text-[15px] leading-7 text-[#647087]'>
								Ваш аккаунт Streaming Platform и связанные с ним
								данные удалены. Войти в аккаунт и восстановить
								профили, настройки и подборки больше нельзя.
							</Text>

							<Hr className='my-7 border-[#edf0f5]' />

							<Text className='m-0 text-xs leading-5 text-[#8a94a7]'>
								Если вы не запрашивали удаление аккаунта,
								свяжитесь со службой поддержки.
							</Text>
						</Section>

						<Text className='mt-[18px] mb-0 text-center text-xs leading-5 text-[#98a2b3]'>
							Спасибо, что были с нами.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
