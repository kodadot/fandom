import { Handlers, PageProps } from "$fresh/server.ts"
import { Footer } from "@/components/Footer.tsx"
import { HeadElement } from "@/components/HeadElement.tsx"
import { Header } from "@/components/Header.tsx"
import IconCart from "@/components/IconCart.tsx"
import { formatBalance, sanitizeUri } from "@/utils/data.ts"
import { graphql } from "@/utils/indexer.ts"
import { useComputed } from "@preact/signals"
import { aspectRatio } from "@twind/aspect-ratio"
import { extendFields, getClient } from 'https://esm.sh/@kodadot1/uniquery@0.2.0-rc.3'
import { tw } from "twind"
import { Item } from "@/utils/types.ts"


const client = getClient()
const { query: q } = client.itemListByCollectionId('2551182625', {
  fields: extendFields(['meta', 'price'])
})

interface Data {
  items: Item[];
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const data = await graphql<Data>(q);
    return ctx.render(data);
  },
};

export default function Home(ctx: PageProps<Data>) {
  const { data, url } = ctx;
  const products = data.items;

  return (
    <div>
      <HeadElement
        description="KodaDot fandom shop."
        image={url.href + "og-image.jpeg"}
        title="KodaDot Fresh"
        url={url}
      />
      <Header />
      <div
        class="w-11/12 max-w-5xl mx-auto mt-28"
        aria-labelledby="information-heading"
      >
        <h2 id="information-heading" class="sr-only">
          Product List
        </h2>
        <div
          class="grid grid-cols-1 gap-8 sm:!gap-x-10 sm:!grid-cols-2 lg:!grid-cols-3 lg:!gap-x-12 lg:!gap-y-10"
        >
          {products.map((product) => <ProductCard product={product} />)}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ProductCard(props: { product: Item }) {
  const { product } = props;
  const image = useComputed(() => sanitizeUri(product.image || product.meta?.image));
  const price = useComputed(() => formatBalance(product.price));

  return (
    <a key={product.id} href={`/products/${product.id}`} class="group">
      <div
        class={tw`${
          aspectRatio(1, 1)
        } w-full bg-white rounded-xl overflow-hidden border-2 border-gray-200 transition-all duration-500 relative`}
      >
        {image && (
          <img
            src={image.value}
            alt={product.name}
            width="400"
            height="400"
            class="w-full h-full object-center object-contain absolute block"
          />
        )}
        <div
          class="w-full h-full flex items-center justify-center bg-[rgba(255,255,255,0.6)] opacity-0 group-hover:opacity-100 transition-all duration-500"
        >
          <IconCart size={30} />
        </div>
      </div>
      <div class="flex items-center justify-between mt-3">
        <h3 class="text-lg text-gray-800 font-medium relative">
          {product.name}
          <span
            class="bg-gray-800 h-[3px] w-0 group-hover:!w-full absolute bottom-[-2px] left-0 transition-all duration-400"
          />
        </h3>
        <strong class="text-lg font-bold text-gray-800">
          { price.value }
        </strong>
      </div>
    </a>
  );
}
