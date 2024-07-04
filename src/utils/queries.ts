import { QueryOptions } from '@tanstack/react-query'
import { ErrAccountNotFound, ErrElectionNotFound, ErrTransactionNotFound } from '@vocdoni/sdk'

// Retry up to 3 times for errors other than 404
export const retryUnlessNotFound: QueryOptions['retry'] = (failureCount: number, error: any) => {
  if (
    error instanceof ErrElectionNotFound ||
    error instanceof ErrAccountNotFound ||
    error instanceof ErrTransactionNotFound
  ) {
    return false // Do not retry if the error is a 404
  }
  return failureCount < 3 // Retry up to 3 times for other errors
}
