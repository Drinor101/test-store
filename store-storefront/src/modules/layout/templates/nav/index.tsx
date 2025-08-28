import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { retrieveCart } from "@lib/data/cart"
import { StoreRegion } from "@medusajs/types"
import EnhancedHeader from "@components/layout/header/enhanced-header"

export default async function Nav() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  const categories = await listCategories()
  const cart = await retrieveCart().catch(() => null)

  return <EnhancedHeader categories={categories || []} cart={cart} />
}
