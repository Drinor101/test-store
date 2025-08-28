import { Metadata } from "next"

import { listProducts } from "@lib/data/products"
import EnhancedStoreTemplate from "@components/store/enhanced-store-template"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    q?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, q } = searchParams

  const { response } = await listProducts({
    countryCode: params.countryCode,
    queryParams: {
      limit: 20,
      ...(q && { q })
    }
  })

  return (
    <EnhancedStoreTemplate
      initialProducts={response.products}
      countryCode={params.countryCode}
      sortBy={sortBy}
      searchQuery={q}
    />
  )
}
