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
export class ChangeEmailInput {
	@Field(() => String)
	@Transform(({ value }) =>
		typeof value === 'string' ? value.trim().toLowerCase() : value
	)
	@IsString()
	@IsNotEmpty()
	@IsEmail({}, { message: 'Некорректный email' })
	@MaxLength(254)
	public email: string
}
