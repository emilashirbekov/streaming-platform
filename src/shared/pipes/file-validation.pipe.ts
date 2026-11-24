import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform
} from '@nestjs/common'
import { ReadStream } from 'fs'

import { validateFileFormat, validateFileSize } from '../utils/file.util'

@Injectable()
export class FileValidationPipe implements PipeTransform {
	public async transform(value: any, metadata: ArgumentMetadata) {
		if (!value.filename) throw new BadRequestException('Файл не загружен')

		const { filename, createReadStream } = value
		const fileStream = createReadStream() as ReadStream

		const allowedFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif']
		const isFileFormatValid = validateFileFormat(filename, allowedFormats)

		if (!isFileFormatValid)
			throw new BadRequestException('Формат файла не поддерживается')

		const isFileSizeValid = await validateFileSize(
			fileStream,
			10 * 1024 * 1024
		)

		if (!isFileSizeValid)
			throw new BadRequestException('Размер файла превышает 10 мб')

		return value
	}
}
