import { Module } from '@nestjs/common'

import { MailModule } from '@/modules/libs/mail/mail.module'

import { VerificationResolver } from './verification.resolver'
import { VerificationService } from './verification.service'

@Module({
	imports: [MailModule],
	providers: [VerificationResolver, VerificationService],
	exports: [VerificationService]
})
export class VerificationModule {}
