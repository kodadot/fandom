import { Handlers, PageProps } from "$fresh/server.ts";
import { Footer } from "@/components/Footer.tsx";
import { HeadElement } from "@/components/HeadElement.tsx";
import { Header } from "@/components/Header.tsx";
import IconCart from "@/components/IconCart.tsx";
import { formatBalance, sanitizeUri } from "@/utils/data.ts";
import { graphql } from "@/utils/indexer.ts";
import { Item } from "@/utils/types.ts";
import { useComputed } from "@preact/signals";
import { aspectRatio } from "@twind/aspect-ratio";
import { extendFields, getClient } from "@kodadot1/uniquery";
import { tw } from "twind";

const client = getClient("ahp");
const collectionId = Deno.env.get("COLLECTION_ID") || "11";

interface ItemsResult {
  items: Item[];
}

interface CountResult {
  itemCount: {
    totalCount: number;
  };
}

interface Data {
  items: Item[];
  page: number;
  pageCount: number;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const url = new URL(req.url);

    const countQuery = client.itemCountByCollectionId(collectionId);
    const count = await graphql<CountResult>(
      countQuery.query,
      countQuery.variables,
    )
      .then((result) => result?.itemCount?.totalCount);

    const itemsPerPage = 12;
    const pageCount = Math.ceil(count / itemsPerPage);
    const page = Math.min(
      Math.max(Number(url.searchParams.get("page")), 1),
      pageCount,
    );

    const { query: dataQuery } = client.itemListByCollectionId(collectionId, {
      fields: extendFields(["meta", "price"]),
      orderBy: "createdAt_ASC",
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
    });

    const { items } = await graphql<ItemsResult>(dataQuery);
    const data: Data = {
      items,
      page,
      pageCount,
    };

    return ctx.render(data);
  },
};

export default function Home(ctx: PageProps<Data>) {
  const { data, url } = ctx;
  const { items: products, page, pageCount } = data;

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
        <div class="grid grid-cols-1 gap-8 sm:!gap-x-10 sm:!grid-cols-2 lg:!grid-cols-3 lg:!gap-x-12 lg:!gap-y-10">
          {products.map((product) => <ProductCard product={product} />)}
        </div>

        <div class="px-3 py-2 mt-4 flex items-center justify-center">
          <div class="flex bg-gray-200 divide-x divide-gray-300 rounded-md overflow-hidden">
            {page > 1 && (
              <a
                href={`/?page=${page - 1}`}
                class="py-1 px-3 font-bold font-mono block"
              >
                &lt;
              </a>
            )}

            {Array(pageCount).fill(0).map((_, idx) => (
              <a
                href={`/?page=${idx + 1}`}
                class={`py-1 px-4 font-bold block ${
                  (idx + 1 === page) ? "bg-gray-700 text-white" : ""
                }`}
              >
                {idx + 1}
              </a>
            ))}

            {page < pageCount && (
              <a
                href={`/?page=${page + 1}`}
                class="py-1 px-3 font-bold font-mono block"
              >
                &gt;
              </a>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function ProductCard(props: { product: Item }) {
  const { product } = props;
  const image = useComputed(() =>
    sanitizeUri(product.image || product.meta?.image)
  );
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
        <div class="w-full h-full flex items-center justify-center bg-[rgba(255,255,255,0.6)] opacity-0 group-hover:opacity-100 transition-all duration-500">
          <IconCart size={30} />
        </div>
      </div>
      <div class="flex items-center justify-between mt-3">
        <h3 class="text-lg text-gray-800 font-medium relative">
          {product.name}
          <span class="bg-gray-800 h-[3px] w-0 group-hover:!w-full absolute bottom-[-2px] left-0 transition-all duration-400" />
        </h3>
        <strong class="text-lg font-bold text-gray-800">
          {price.value}
        </strong>
      </div>
    </a>
  );
}
