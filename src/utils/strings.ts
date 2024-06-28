export const shortHex = (hex: string) => hex.substring(0, 6) + '...' + hex.substring(hex.length - 4)

/**
 * ucfirst makes the first letter of a string uppercase
 */
export const ucfirst = (str: string, lng?: string | undefined) => str.charAt(0).toLocaleUpperCase(lng) + str.slice(1)

/** Used to test if a string is base64 encoded. Used by b64ToHex*/
const regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/

/** If is a base64 string return hex bytes */
// export const b64ToHex = (b64String: string): string =>
//   regex.test(b64String) ? Buffer.from(b64String, 'base64').toString('hex') : b64String
export const b64ToHex = (b64String: string): string => {
  if (!regex.test(b64String)) {
    return b64String
  }

  // Decode base64 string
  const binaryString = atob(b64String)
  let hexString = ''

  // Convert each character to its hexadecimal equivalent
  for (let i = 0; i < binaryString.length; i++) {
    const hex = binaryString.charCodeAt(i).toString(16)
    hexString += ('00' + hex).slice(-2)
  }

  return hexString
}

/** Iterate an object and convert all base64 strings to hex
 *
 * It check if is a string and can be converted to a regex.
 */
export const objectB64StringsToHex = (obj: any, ignoreKeys?: string[]): void => {
  for (const k in obj) {
    if (ignoreKeys != null && ignoreKeys.indexOf(k) > -1) continue
    if (typeof obj[k] === 'string' && regex.test(obj[k])) {
      try {
        obj[k] = b64ToHex(obj[k])
      } catch (e) {
        console.debug("Can't convert (may be not a b64 string)", k, obj[k])
      }
    } else if (typeof obj[k] == 'object' && obj[k] !== null) {
      objectB64StringsToHex(obj[k])
    }
  }
}
