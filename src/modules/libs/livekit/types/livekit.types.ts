import { FactoryProvider, ModuleMetadata } from '@nestjs/common'

export const LiveKitOptionsSymbol = Symbol('LiveKitOptionsSymbol')

export type TypeLiveKitOptions = {
	apiUrl: string
	apiKey: string
	apiSecret: string
}

export type TypeLiveKitAsyncOptions = Pick<ModuleMetadata, 'imports'> & {
	useFactory: (
		...args: any[]
	) => TypeLiveKitOptions | Promise<TypeLiveKitOptions>
	inject?: FactoryProvider<TypeLiveKitOptions>['inject']
}
