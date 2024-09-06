import { API, ErrTransactionNotFound, Tx } from '@vocdoni/sdk'

// This page implements the vocdoni SDK deprecated API methods but that are still used in this project and supported by the API

enum ChainAPIMethods {
  TX_INFO_BLOCK = '/chain/transactions/{block}/{index}',
}

export abstract class DeprecatedChainAPI extends API {
  public static txInfoByBlock = async (url: string, block: number, index: number) => {
    return fetch(
      url + ChainAPIMethods.TX_INFO_BLOCK.replace('{block}', String(block)).replace('{index}', String(index))
    )
      .then(async (response) => {
        if (response.status === 204) {
          throw new ErrTransactionNotFound()
        }
        const data: Tx = await response.json()
        return data
      })
      .catch(this.isApiError)
  }
}
