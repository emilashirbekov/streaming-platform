import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js'

import { User } from '@/generated/prisma'
import { Authorization } from '@/shared/decorators/auth.decorator'
import { Authorized } from '@/shared/decorators/authorized.decorator'
import { FileValidationPipe } from '@/shared/pipes/file-validation.pipe'

import { ChangeInfoInput } from './inputs/change-info.inputs'
import {
	SocialLinkInput,
	SocialLinkOrderInput
} from './inputs/social-link.input'
import { ProfileService } from './profile.service'
import type { GraphQLFileUpload } from './types/graphql-file-upload.type'

@Resolver('Profile')
export class ProfileResolver {
	constructor(private readonly profileService: ProfileService) {}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeProfileAvatar' })
	public async changeAvatar(
		@Authorized() user: User,
		@Args('avatar', { type: () => GraphQLUpload }, FileValidationPipe)
		upload: GraphQLFileUpload
	) {
		return this.profileService.changeAvatar(user, upload)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeProfileAvatar' })
	public async removeAvatar(@Authorized() user: User) {
		return this.profileService.removeAvatar(user)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'changeProfileInfo' })
	public async changeInfo(
		@Authorized() user: User,
		@Args('data') input: ChangeInfoInput
	) {
		return this.profileService.changeInfo(user, input)
	}

	@Authorization()
	@Query(() => Boolean, { name: 'findSocialLinks' })
	public async findSocialLinks(@Authorized() user: User) {
		return this.profileService.findSocialLinks(user)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'createSocialLink' })
	public async createSocialLink(
		@Authorized() user: User,
		@Args('data') input: SocialLinkInput
	) {
		return this.profileService.createSocialLink(user, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'reorderSocialLink' })
	public async reorderSocialLink(
		@Args('list', { type: () => [SocialLinkInput] })
		list: SocialLinkOrderInput[]
	) {
		return this.profileService.reorderSocialLinks(list)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'updateSocialLink' })
	public async updateSocialLink(
		@Authorized() id: string,
		@Args('data') input: SocialLinkInput
	) {
		return this.profileService.updateSocialLink(id, input)
	}

	@Authorization()
	@Mutation(() => Boolean, { name: 'removeSocialLink' })
	public async removeSocialLink(@Args('id') id: string) {
		return this.profileService.remove(id)
	}
}
