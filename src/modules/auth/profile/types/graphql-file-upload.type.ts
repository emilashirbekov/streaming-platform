import type { Readable } from 'node:stream'

export interface GraphQLFileUpload {
	filename: string
	mimetype: string
	encoding: string
	createReadStream(): Readable
}
