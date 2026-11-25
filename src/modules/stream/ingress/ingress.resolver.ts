import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { IngressInput } from 'livekit-server-sdk'

import { User } from '@/generated/prisma'
import { Authorization } from '@/shared/decorators/auth.decorator'
import { Authorized } from '@/shared/decorators/authorized.decorator'

import { IngressService } from './ingress.service'

@Resolver('Ingress')
export class IngressResolver {
	constructor(private readonly ingressService: IngressService) {}

	@Authorization()
	@Mutation(() => Boolean, { name: 'createIngress' })
	public async create(
		@Authorized() user: User,
		@Args('ingressType') ingressType: IngressInput
	) {
		return this.ingressService.create(user, ingressType)
	}
}
