import { Field, InputType } from '@nestjs/graphql'
import {
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength
} from 'class-validator'

@InputType()
export class ChangePasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8, { message: 'Пароль должен быть не короче 8 символов' })
	@MaxLength(64, { message: 'Пароль должен быть не длиннее 64 символов' })
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
		message: 'Пароль должен содержать строчную и заглавную букву и цифру'
	})
	public oldPassword: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8, { message: 'Пароль должен быть не короче 8 символов' })
	@MaxLength(64, { message: 'Пароль должен быть не длиннее 64 символов' })
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
		message: 'Пароль должен содержать строчную и заглавную букву и цифру'
	})
	public newPassword: string
}
