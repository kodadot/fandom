import { $purify } from 'https://esm.sh/@kodadot1/minipfs@0.2.0-rc.0'
import useSWR from "swr"

export interface GithubData {
  watchers: number
}

async function githubApiFetcher(): Promise<GithubData> {
  const res = await fetch("https://api.github.com/repos/kodadot/nft-gallery");
  return await res.json();
}

export function useStargazers() {
  return useSWR<GithubData, Error>("watchers", githubApiFetcher);
}

export function formatBalance(amount?: bigint | string) {
  const value = BigInt(amount || BigInt(0));
  const intl = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: 'KSM',
  });
  return intl.format(value / BigInt(1e12));
}

export function sanitizeUri(uri?: string) {
  return uri ? $purify(uri).at(0) : ''
}

export function shortAddress(
  address: string,
  begin?: number,
  end?: number
): string {
  begin = begin ? begin : 6
  end = end ? end : -6

  if (address) {
    return `${address.slice(0, begin)}...${address.slice(end)}`
  }
  return ''
}
