import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-primary-100">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="p-4">
          <h3 className="text-lg font-medium text-primary-900 mb-2 group-hover:text-accent-600 transition-colors duration-200">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            <span className="text-sm text-primary-500">
              {product.variants?.length || 0} variants
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
