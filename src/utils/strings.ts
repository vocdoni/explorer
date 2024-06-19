export const shortHex = (hex: string) => hex.substring(0, 6) + '...' + hex.substring(hex.length - 4)

/**
 * ucfirst makes the first letter of a string uppercase
 */
export const ucfirst = (str: string, lng?: string | undefined) => str.charAt(0).toLocaleUpperCase(lng) + str.slice(1)
