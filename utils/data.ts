import { formatBalance as format } from 'https://deno.land/x/polkadot@0.2.29/util/mod.ts'
import { $purify } from 'https://esm.sh/@kodadot1/minipfs@0.2.0-rc.0'
// import useSWR from "swr"

export interface GithubData {
  watchers: number
}

// async function githubApiFetcher(): Promise<GithubData> {
//   const res = await fetch("https://api.github.com/repos/kodadot/nft-gallery");
//   return await res.json();
// }

export function useStargazers(): { data: GithubData | undefined; error: Error | null } {
  // return useSWR<GithubData, Error>("watchers", githubApiFetcher);
  return { data: { watchers: 500 }, error: null }
}

export function formatBalance(amount?: bigint | string) {
  const value = BigInt(amount || BigInt(0));
  const magic = format(value, { decimals: 12, forceUnit: '-', withZero: false, withUnit: false });
  const intl = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: 'KSM',
    useGrouping: false,
  });
  return intl.format(Number(magic)).replace(',', '.');
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
