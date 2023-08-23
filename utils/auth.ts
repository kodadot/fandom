import { web3Accounts, web3Enable } from 'extension-dapp'
import { InjectedAccountWithMeta } from 'https://esm.sh/@polkadot/extension-inject/types'
import { signal } from '@preact/signals'
import { IS_BROWSER } from '$fresh/runtime.ts'

export const accounts = signal<InjectedAccountWithMeta[]>([])
export const selectedAccount = signal<InjectedAccountWithMeta | null>(null)
export const isLoaded = signal(false)

if (IS_BROWSER) {
  web3Enable('subscaffold dapp').then(() => {
    web3Accounts().then((availableAccounts: InjectedAccountWithMeta[]) => {
      accounts.value = availableAccounts
      isLoaded.value = true

      if (localStorage.getItem('selected_account')) {
        selectedAccount.value = availableAccounts.find((acc) => {
          return acc.address === localStorage.getItem('selected_account')
        }) ?? null
      }
    }).catch((err) => {
      console.error('web3Accounts()', err)
    })
  }).catch((err) => {
    console.error('web3Enable()', err)
  })
}

export function selectAccount(account: InjectedAccountWithMeta) {
  selectedAccount.value = account
  localStorage.setItem('selected_account', account.address)
}