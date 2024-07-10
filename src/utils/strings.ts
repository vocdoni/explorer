/**
 * Creates a substring of a string with the first 6 characters and the last 4 characters with three dots elipsis.
 * It has to be at least 13 characters long.
 * On a future implementation this have to be calculated dynamically based on the width of the container.
 */
export const shortStr = (str: string) =>
  str.length > 13 ? str.substring(0, 6) + '...' + str.substring(str.length - 4) : str

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
