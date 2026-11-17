import { Field, InputType } from '@nestjs/graphql'
import {
	IsNotEmpty,
	IsString,
	IsUUID,
	MaxLength,
	MinLength
} from 'class-validator'

@InputType()
export class VerificationInput {
	@Field()
	@IsNotEmpty()
	@IsUUID('4')
	public token: string
}
