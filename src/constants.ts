import fallbackHeader from '/images/default-image-header.png'
import fallbackAccount from '/images/fallback-account-dark.png'

const evocdoni = import.meta.env.VOCDONI_ENVIRONMENT

let explorer = 'https://explorer.vote'
if (['stg', 'dev'].includes(evocdoni)) {
  explorer = `https://${evocdoni}.explorer.vote`
}

export const ExplorerBaseURL = explorer
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
