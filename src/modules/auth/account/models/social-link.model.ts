import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

import { SocialLink, User } from '@/generated/prisma'

@ObjectType()
export class SocialLinkModel implements SocialLink {
	@Field(() => ID)
	public id: string

	@Field(() => String)
	public title: string

	@Field(() => String)
	public url: string

	@Field(() => Number)
	public position: number

	@Field(() => String)
	public userId: string

	@Field(() => ID)
	public createdAt: Date

	@Field(() => ID)
	public updatedAt: Date

	@Field(() => String, { nullable: true })
	public tokenId: string | null

	@Field(() => String, { nullable: true })
	public streamId: string | null
}
