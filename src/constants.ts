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
// route paths
export enum RoutePath {
  Base = '/',
  Organization = '/organization/:pid',
  OrganizationsList = '/organizations/:page?/:query?',
  Process = '/process/:pid',
  ProcessesList = '/processes/:page?',
}