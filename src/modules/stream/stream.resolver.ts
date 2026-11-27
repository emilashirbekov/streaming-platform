import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js'

import { User } from '@/generated/prisma'
import { Authorization } from '@/shared/decorators/auth.decorator'
import { Authorized } from '@/shared/decorators/authorized.decorator'
import { FileValidationPipe } from '@/shared/pipes/file-validation.pipe'

import type { GraphQLFileUpload } from '../auth/profile/types/graphql-file-upload.type'

import { ChangeStreamInfoInput } from './inputs/change-stream-info.input'
import { FilterInput } from './inputs/filter.inputs'
import { GenerateStreamToken } from './inputs/generate-stream-token.input'
import { GenerateStreamTokenModel } from './models/generate-stream-token.model'
import { StreamModel } from './models/stream.model'
import { StreamService } from './stream.service'

@Resolver('Stream')
export class StreamResolver {
	constructor(private readonly streamService: StreamService) {}

	@Query(() => [StreamModel], { name: 'findAllStreams' })
	public async findAll(@Args('filter') input: FilterInput) {
		return this.streamService.findAll(input)
	}

	@Query(() => [StreamModel], { name: 'findRandomStremas' })
	public async findRandom() {
		return this.streamService.findRandom()
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamInfo' })
	public async changeStreamInfo(
		@Authorized() user: User,
		@Args('data') input: ChangeStreamInfoInput
	) {
		return this.streamService.changeStreamInfo(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeStreamThumbnail' })
	public async changeStreamThumbnail(
		@Authorized() user: User,
		@Args('thumbnail', { type: () => GraphQLUpload }, FileValidationPipe)
		thumbnail: GraphQLFileUpload
	) {
		return this.streamService.changeStreamThumbnail(user, thumbnail)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeThumbnail' })
	public async removeThumbnail(@Authorized() user: User) {
		return this.streamService.removeThumbnail(user)
	}

	@Mutation(() => GenerateStreamTokenModel, { name: 'generateStreamToken' })
	public async generateToken(@Args('data') input: GenerateStreamToken) {
		return this.streamService.generateStreamToken(input)
	}
}
