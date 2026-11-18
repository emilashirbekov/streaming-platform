import { Field, InputType } from '@nestjs/graphql'
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	IsUUID,
	MinLength,
	Validate
} from 'class-validator'

import { isPasswordMatching } from '@/shared/decorators/is-password-matching.decorator'

@InputType()
export class NewPasswordInput {
	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	public password: string

	@Field(() => String)
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@Validate(isPasswordMatching)
	public passwordRepeat: string

	@Field()
	@IsNotEmpty()
	@IsUUID('4')
	public token: string
}
