import { isB64Regex } from '~constants'

export function isEmpty(obj?: object): boolean {
  return !obj || Object.keys(obj).length === 0
}

/**
 * If is a base64 string return hex bytes
 * @param b64String string to check if is b64 and if so convert to hex
 */
export const b64ToHex = (b64String: string): string => {
  if (!isB64Regex.test(b64String)) {
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
    if (typeof obj[k] === 'string' && isB64Regex.test(obj[k])) {
      try {
        obj[k] = b64ToHex(obj[k])
      } catch (e) {
        console.warn("Can't convert (maybe is not a b64 string)", k, obj[k])
      }
    } else if (typeof obj[k] == 'object' && obj[k] !== null) {
      objectB64StringsToHex(obj[k])
    }
  }
}
