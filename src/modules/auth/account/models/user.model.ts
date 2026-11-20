import { Field, ID, ObjectType } from '@nestjs/graphql'

import { User } from '@/generated/prisma'

@ObjectType()
export class UserModel implements User {
	@Field(() => ID)
	id: string

	@Field(() => String)
	email: string

	@Field(() => String)
	password: string

	@Field(() => String)
	username: string

	@Field(() => String)
	displayName: string

	@Field(() => String, { nullable: true })
	avatar: string

	@Field(() => String, { nullable: true })
	bio: string

	@Field(() => Boolean)
	isEmailVerified: boolean

	@Field(() => Boolean)
	isTotpEnabled: boolean

	@Field(() => Boolean)
	isDeactivated: boolean

	@Field(() => Date, { nullable: true })
	deactivatedAt: Date

	@Field(() => String, { nullable: true })
	totpSecret: string

	@Field(() => Boolean)
	isVerified: boolean

	@Field(() => ID)
	createdAt: Date

	@Field(() => ID)
	updatedAt: Date
}
