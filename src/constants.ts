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
  TransactionByHashOrHeight = '/transactions/id/:hashOrHeight',
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

export const whitelist = [
  'f82f1c5f48a4751b65c5c69a7de85f337b82b2d6',
  'a52f5588f7bb9f3c6d6b7cf003a5b03f4589edea',
  '1259afa8e3e1c6526b4b9cad75eb07e2c231cc65',
  '2b142d1a8e95a2c7b02a795df4f9a1d18ee51215',
  '63ca71be6765bc582f254eb1c49cf9739bbf798e',
  '5fb10cc1027db85859b89153e55f3e3899d76e79',
  '11f1f8992def6a59ffdfb9bda639dc309a7c289c',
  '8fc30a4c3d11b3b866947c29e4a5525d71f1ff33',
  'a79bf878a219a469c45917b866afc9d681df736f',
]
