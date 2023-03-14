import ProductAction from "@/islands/ProductAction.tsx"
import { formatBalance, sanitizeUri, shortAddress } from "@/utils/data.ts"
import { Item as Product } from "@/utils/types.ts"
import { useComputed } from "@preact/signals"
import { aspectRatio } from "@twind/aspect-ratio"
import { tw } from "twind"
import { css } from "twind/css"

const descriptionStyles = css({
  "a": {
    color: "#056CF0",
  },
  "a:hover": {
    textDecoration: "underline",
  },
});

export default function ProductDetails({ product }: { product: Product }) {
  const image = useComputed(() => sanitizeUri(product.image || product.meta?.image));
  const price = useComputed(() => formatBalance(product.price));
  const collectionId = useComputed(() => product.id.split('-').at(0));
  
  return (
    <div class="w-11/12 max-w-5xl mx-auto mt-8 lg:grid lg:grid-cols-2 lg:gap-x-16">
      {/* Product details */}
      <div>
        <div class="flex flex-col gap-4">
          <div class="w-full flex items-center justify-between gap-4">
            <hgroup>
              <h2 class="text-xl lg:!text-2xl font-semibold text-gray-800">
                {product.name}
              </h2>
              <h3 class="text-gray-500 text-base leading-tight">
              Owned by {' '}
              <a class="text-blue-500 hover:underline" target="_blank" href={`https://kodadot.xyz/bsx/u/${product.currentOwner}`} >
              { shortAddress(product.currentOwner)}
              </a>
              </h3>
              <h3 class="text-gray-500 text-base leading-tight">
              Collection {' '}
              <a class="text-blue-500 hover:underline" href={`/collections/${collectionId.value}`} >
              { collectionId.value }
              </a>
              </h3>
            </hgroup>
            <div class="bg-[#E8E7E5] rounded-full px-6 py-2 text-lg text-gray-900 font-bold">
              { price.value }
            </div>
          </div>
        </div>

        <section
          aria-labelledby="information-heading"
          class="mt-12 pt-6 border-t-1 border-gray-200"
        >
          <h2 id="information-heading" class="sr-only">
            Product information
          </h2>

          <div class="mt-4 space-y-6">
            <p
              class={tw`text-base text-gray-600 ${descriptionStyles}`}
              dangerouslySetInnerHTML={{ __html: product.meta?.description || product.name }}
            />
          </div>
        </section>
      </div>

      {/* Product image */}
      <div
        class={tw`${
          aspectRatio(1, 1)
        } w-full bg-white rounded-xl border-2 border-gray-200 mt-12 lg:mt-0 lg:col-start-2 lg:row-span-2 lg:self-start`}
      >
        <div class="rounded-lg overflow-hidden">
          {image && (
            <img
              id="productImage"
              src={image.value}
              alt={product.name}
              width="400"
              height="400"
              class="w-full h-full object-center object-contain"
            />
          )}

        </div>
      </div>

      {/* Product form */}
      <div class="mt-12 lg:max-w-lg lg:col-start-1 lg:row-start-2 lg:self-start">
        <section aria-labelledby="options-heading">
          <div class="mt-4">
            <ProductAction id={product.id} />
          </div>
        </section>
      </div>
    </div>
  );
}
