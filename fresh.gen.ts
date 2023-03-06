// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/_app.tsx";
import * as $1 from "./routes/api/shopify.ts";
import * as $2 from "./routes/index.tsx";
import * as $3 from "./routes/products/[product].tsx";
import * as $$0 from "./islands/AddToCart.tsx";
import * as $$1 from "./islands/ProductDetails.tsx";

const manifest = {
  routes: {
    "./routes/_app.tsx": $0,
    "./routes/api/shopify.ts": $1,
    "./routes/index.tsx": $2,
    "./routes/products/[product].tsx": $3,
  },
  islands: {
    "./islands/AddToCart.tsx": $$0,
    "./islands/ProductDetails.tsx": $$1,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
