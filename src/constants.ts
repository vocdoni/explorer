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
  Block = '/block/:height/:tab?/:page?',
  BlocksList = '/blocks/:page?',
  Envelope = '/envelope/:verifier/:tab?',
  Account = '/account/:pid/:tab?/:page?',
  AccountsList = '/accounts/:page?',
  Process = '/process/:pid/:tab?',
  ProcessesList = '/processes/:page?',
  Transaction = '/transactions/:block/:index/:tab?',
  TransactionsList = '/transactions/:page?',
  TransactionByHash = '/transactions/id/:hash/:tab?',
  Validator = '/validator/:address/:tab?',
  Validators = '/validators',
  Verify = '/verify/:verifier?/:tab?',
}

// old explorer route paths (used by RouteRedirector)
export enum OldRoutePath {
  BlockDetails = '/blocks/show/#/',
  EnvelopeDetails = '/envelopes/show/#/',
  OrganizationDetails = '/organizations/show/#/',
  ProcessDetails = '/processes/show/#/',
  TransactionDetails = '/transactions/show/#/',
  Verify = '/verify/#/',
  Stats = '/stats',
  OrganizationsList = '/organizations',
  Organization = '/organization',
}

// Used to test if a string is base64 encoded. Used by b64ToHex
export const isB64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/

// Block creation interval to refetch
export const RefreshIntervalBlocks = 10000
// Refetch interval used on paginated lists
export const RefreshIntervalPagination = 30000
