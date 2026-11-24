import { Module } from '@nestjs/common'

import { StorageModule } from '@/modules/libs/mail/storage/storage.module'

import { ProfileService } from './profile.service'
import { ProfileResolver } from './profile.resolver'

@Module({
	imports: [StorageModule],
	providers: [ProfileResolver, ProfileService]
})
export class ProfileModule {}
