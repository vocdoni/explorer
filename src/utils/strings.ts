export const shortHex = (hex: string) => hex.substring(0, 6) + '...' + hex.substring(hex.length - 4)

/**
 * ucfirst makes the first letter of a string uppercase
 */
export const ucfirst = (str: string, lng?: string | undefined) => str.charAt(0).toLocaleUpperCase(lng) + str.slice(1)

/**
 * Checks if a string is a valid hexadecimal with the correct length. Useful to check if processIds or orgsId are valid.
 */
export const isValidPartialProcessId = (str: string) => {
  const hexRegex = /^[0-9A-Fa-f]+$/
  return hexRegex.test(str) && str.length % 2 === 0
}
