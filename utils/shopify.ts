import { ask } from 'https://esm.sh/@kodadot1/uniquery@0.1.1-rc.0'
// import { getClient } from 'https://esm.sh/@kodadot1/uniquery@0.1.1-rc.0'

const ADDRESS = Deno.env.get("ADDRESS");
const CHAIN = Deno.env.get("CHAIN");

if (ADDRESS === undefined || CHAIN === undefined) {
  throw new Error(
    "env `ADDRESS` and `CHAIN` must be set",
  );
}

export async function getItemList<T>() {
  await ask<T>(`/${CHAIN}/nftByIssuer/${ADDRESS}`)
}

export async function getItem<T>(id: string) {
  await ask<T>(`/${CHAIN}/nftByIssuer/${id}`)
}

export async function graphql<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const resp = await fetch(CHAIN!, {
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
