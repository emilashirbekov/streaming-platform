import { Field, InputType } from '@nestjs/graphql'
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Length,
	MaxLength,
	MinLength
} from 'class-validator'

@InputType()
export class DeactivateAccountInput {
	@Field()
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	public email: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8, { message: 'Пароль должен быть не короче 8 символов' })
	@MaxLength(64, { message: 'Пароль должен быть не длиннее 64 символов' })
	public password: string

	@Field()
	@IsString()
	@IsNotEmpty()
	@Length(6, 6)
	public pin: string
}
