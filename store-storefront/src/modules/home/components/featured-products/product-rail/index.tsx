import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
      limit: 6,
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-primary-900 mb-2">
          {collection.title}
        </h3>
        <InteractiveLink 
          href={`/collections/${collection.handle}`}
          className="text-accent-600 hover:text-accent-700 font-medium"
        >
          View all products →
        </InteractiveLink>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <div key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </div>
          ))}
      </div>
    </div>
  )
}
