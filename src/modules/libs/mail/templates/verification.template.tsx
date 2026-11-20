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

interface VerificationTemplateProps {
	domain: string
	token: string
	username?: string
}

export function VerificationTemplate({
	domain,
	token,
	username
}: VerificationTemplateProps) {
	const verificationUrl = new URL('/account/verify', domain)
	verificationUrl.searchParams.set('token', token)

	return (
		<Html lang='ru'>
			<Head />
			<Preview>
				Подтвердите почту и присоединяйтесь к Streaming Platform
			</Preview>
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
								ПОСЛЕДНИЙ ШАГ
							</Text>
							<Heading className='mt-0 mb-[18px] text-[30px] leading-[1.2] font-bold tracking-[-0.7px] text-[#182235]'>
								Подтвердите свою почту
							</Heading>
							<Text className='mt-0 mb-2 text-base leading-6 font-semibold text-[#344158]'>
								{username
									? `Привет, ${username}!`
									: 'Добро пожаловать!'}
							</Text>
							<Text className='m-0 text-[15px] leading-7 text-[#647087]'>
								Подтвердите адрес электронной почты, чтобы
								завершить регистрацию и открыть для себя свою
								следующую любимую историю.
							</Text>

							<Section className='mt-7 mb-[22px]'>
								<Button
									href={verificationUrl.toString()}
									className='inline-block rounded-[9px] bg-[#635bff] px-6 py-4 text-center text-[15px] leading-none font-bold text-white no-underline'
								>
									Подтвердить адрес
								</Button>
							</Section>

							<Text className='mt-0 mb-2 text-xs leading-5 text-[#78849a]'>
								Ссылка действительна 5 минут. Если кнопка не
								работает, откройте ссылку:
							</Text>
							<Link
								href={verificationUrl.toString()}
								className='break-all text-xs leading-5 text-[#5148e5] underline'
							>
								{verificationUrl.toString()}
							</Link>

							<Hr className='my-7 border-[#edf0f5]' />

							<Text className='m-0 text-xs leading-5 text-[#8a94a7]'>
								Если вы не создавали аккаунт, просто
								проигнорируйте это письмо.
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
