import { Field, InputType } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Matches,
	MaxLength,
	MinLength
} from 'class-validator'

@InputType()
export class CreateUserInput {
	@Field(() => String)
	@Transform(({ value }) =>
		typeof value === 'string' ? value.trim() : value
	)
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(20)
	@Matches(/^[a-zA-Z0-9_]+$/, {
		message: 'Username может содержать только латинские буквы, цифры и _'
	})
	public username: string

	@Field(() => String)
	@Transform(({ value }) =>
		typeof value === 'string' ? value.trim().toLowerCase() : value
	)
	@IsString()
	@IsNotEmpty()
	@IsEmail({}, { message: 'Некорректный email' })
	@MaxLength(254)
	public email: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8, { message: 'Пароль должен быть не короче 8 символов' })
	@MaxLength(64, { message: 'Пароль должен быть не длиннее 64 символов' })
	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
		message: 'Пароль должен содержать строчную и заглавную букву и цифру'
	})
	public password: string
}
