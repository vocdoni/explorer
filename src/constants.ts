import fallbackHeader from '/images/default-image-header.png'
import fallbackAccount from '/images/fallback-account-dark.png'

const evocdoni = import.meta.env.VOCDONI_ENVIRONMENT

let appUrl = 'https://app.vocdoni.io'
if (['stg', 'dev'].includes(evocdoni)) {
  appUrl = `https://app-${evocdoni}.vocdoni.io`
}

export const AppBaseURL = appUrl

export const VocdoniEnvironment = evocdoni

export const FallbackHeaderImg = fallbackHeader
export const FallbackAccountImg = fallbackAccount

export const PaginationItemsPerPage = 10

// route paths
export enum RoutePath {
  Base = '/',
  Block = '/block/:height',
  BlocksList = '/blocks/:page?',
  Envelope = '/envelope/:verifier',
  Organization = '/organization/:pid',
  OrganizationsList = '/organizations/:page?/:query?',
  Process = '/process/:pid',
  ProcessesList = '/processes/:page?',
  Transaction = '/transactions/:block/:index',
  TransactionsList = '/transactions/:page?',
  Validators = '/validators',
  Verify = '/verify/:verifier?',
}

// Used to test if a string is base64 encoded. Used by b64ToHex
export const isB64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/

// ms to wait on queries refetch interval
// Used on paginated lists
export const RefetchInterval = 5000
