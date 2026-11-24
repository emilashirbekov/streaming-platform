import { Field, InputType } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength
} from 'class-validator'

@InputType()
export class ChangeInfoInput {
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
		typeof value === 'string' ? value.trim() : value
	)
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(20)
	public displayName: string

	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	@MaxLength(300)
	@IsOptional()
	public bio?: string
}
