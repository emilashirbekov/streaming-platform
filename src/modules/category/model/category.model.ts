import { Field, ID, ObjectType } from '@nestjs/graphql'

import { Category } from '@/generated/prisma'
import { StreamModel } from '@/modules/stream/models/stream.model'

@ObjectType()
export class CategoryModel implements Category {
	@Field(() => ID)
	id: string

	@Field(() => String)
	title: string

	@Field(() => String)
	slug: string

	@Field(() => String, { nullable: true })
	description: string | null

	@Field(() => String, { nullable: true })
	thumbnailUrl: string | null

	@Field(() => [StreamModel])
	streams: StreamModel[]

	@Field(() => Date)
	createdAt: Date

	@Field(() => Date)
	updatedAt: Date
}
