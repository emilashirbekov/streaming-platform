import { Buffer } from 'node:buffer'
import type { ReadStream } from 'node:fs'

export function validateFileFormat(
	fileName: string,
	allowedFileFormats: string[]
) {
	const fileParts = fileName.split('.')
	const extension = fileParts[fileParts.length - 1]

	return allowedFileFormats.includes(extension)
}

export async function validateFileSize(
	fileStream: ReadStream,
	allowedFileSizeInBytes: number
): Promise<boolean> {
	return new Promise((res, rej) => {
		let fileSizeInBytes = 0

		fileStream
			.on('data', (chunk: string | Buffer) => {
				fileSizeInBytes += Buffer.byteLength(chunk)
			})
			.on('end', () => {
				res(fileSizeInBytes <= allowedFileSizeInBytes)
			})
			.on('error', err => {
				rej(err)
			})
	})
}
