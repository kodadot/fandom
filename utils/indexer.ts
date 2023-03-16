import { INDEXERS, Prefix } from "https://esm.sh/@kodadot1/static@0.0.1-rc.0"
import { ask } from 'https://esm.sh/@kodadot1/uniquery@0.2.1-rc.0'

const CHAIN = Deno.env.get("CHAIN") as Prefix | undefined;

if (CHAIN === undefined) {
  throw new Error(
    "env `CHAIN` must be set",
  );
}

const ENDPOINT = INDEXERS[CHAIN!];

if (ENDPOINT === undefined) {
  throw new Error(
    `indexer for ${CHAIN} not found`,
  );
}

// export async function getItemList<T>() {
//   await ask<T>(`/${CHAIN}/nftByIssuer/${ADDRESS}`)
// }

export async function getItem<T>(id: string) {
  await ask<T>(`/${CHAIN}/nftByIssuer/${id}`)
}

export async function graphql<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const resp = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`${resp.status} ${body}`);
  }
  const json = await resp.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: Error) => e.message).join("\n"));
  }
  return json.data as T;
  // Sleep for 1 second
  // await new Promise((resolve) => setTimeout(resolve, 1000))
  // return {} as T
}
