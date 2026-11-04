export function parseBoolean(value: unknown): boolean {
	if (typeof value === 'boolean') return value

	if (typeof value === 'string') {
		const normalized = value.trim().toLowerCase()

		if (['true', '1', 'yes', 'on'].includes(normalized)) return true
		if (['false', '0', 'no', 'off', ''].includes(normalized)) return false
	}

	if (typeof value === 'number') return value === 1

	throw new Error(
		`Invalid boolean value: "${String(value)}". Use true/false, 1/0, yes/no, on/off`
	)
}
