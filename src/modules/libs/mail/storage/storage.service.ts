import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client
} from '@aws-sdk/client-s3'
import type {
	DeleteObjectCommandInput,
	PutObjectCommandInput
} from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class StorageService {
	private readonly client: S3Client

	public constructor(private readonly configService: ConfigService) {
		const endpoint = this.configService.get<string>('S3_ENDPOINT')
		const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY_ID')
		const secretAccessKey = this.configService.get<string>(
			'S3_SECRET_ACCESS_KEY'
		)
		const credentials =
			accessKeyId && secretAccessKey
				? { accessKeyId, secretAccessKey }
				: undefined

		this.client = new S3Client({
			endpoint,
			region: this.configService.get<string>('S3_REGION') ?? 'us-east-1',
			forcePathStyle: Boolean(endpoint),
			credentials
		})
	}

	public async upload(buffer: Buffer, key: string, mimeType: string) {
		const command: PutObjectCommandInput = {
			Bucket: this.configService.getOrThrow<string>('S3_BUCKET'),
			Key: key,
			Body: buffer,
			ContentType: mimeType
		}

		await this.client.send(new PutObjectCommand(command))
	}

	public async remove(key: string) {
		const command: DeleteObjectCommandInput = {
			Bucket: this.configService.getOrThrow<string>('S3_BUCKET'),
			Key: key
		}

		await this.client.send(new DeleteObjectCommand(command))
	}
}
