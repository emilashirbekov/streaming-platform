import type { Request } from 'express'
import { lookup } from 'geoip-lite'
import * as countries from 'i18n-iso-countries'

import type { SessionMetadata } from '../types/session.metadata.type'

import { IS_DEV } from './is_dev.util'

import DeviceDetector = require('device-detector-js')

countries.registerLocale(require('i18n-iso-countries/langs/en.json'))

function getHeader(value: string | string[] | undefined): string | undefined {
	return Array.isArray(value) ? value[0] : value
}

function getClientIp(req: Request): string {
	const cfIp = getHeader(req.headers['cf-connecting-ip'])
	if (cfIp) return cfIp

	const forwarded = getHeader(req.headers['x-forwarded-for'])
	if (forwarded) return forwarded.split(',')[0].trim()

	return req.ip ?? ''
}

export function getSessionMetadata(
	req: Request,
	userAgent: string
): SessionMetadata {
	const ip = IS_DEV ? '173.166.164.121' : getClientIp(req)

	const device = new DeviceDetector().parse(userAgent)
	const location = lookup(ip)

	return {
		location: {
			country: countries.getName(location.country, 'en') || 'Неизвестно',
			city: location.city,
			latitude: location.ll[0] || 0,
			longitude: location.ll[1] || 0
		},
		device: {
			browser: device.client.name,
			os: device.os.name,
			type: device.device.type
		},
		ip
	}
}
