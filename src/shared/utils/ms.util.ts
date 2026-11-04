const UNITS = {
	ms: 1,
	s: 1_000,
	m: 60_000,
	h: 3_600_000,
	d: 86_400_000,
	w: 604_800_000
} as const

type Unit = keyof typeof UNITS

export function ms(value: string): number {
	const match = /^(\d+(?:\.\d+)?)\s*(ms|s|m|h|d|w)$/i.exec(value.trim())

	if (!match) {
		throw new Error(`Invalid time value: "${value}". Use e.g. "15m", "7d"`)
	}

	return parseFloat(match[1]) * UNITS[match[2].toLowerCase() as Unit]
}
