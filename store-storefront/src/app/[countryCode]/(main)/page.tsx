import { Metadata } from "next"

import HeroBanner from "@components/home/hero-banner"
import FeaturedCollections from "@components/home/featured-collections"
import PromotionalBanners from "@components/home/promotional-banners"
import FeaturedProducts from "@modules/home/components/featured-products"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Store - Quality Products for Everyone",
  description:
    "Discover quality products with a seamless shopping experience. Simple, clean, and reliable.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title, metadata",
  })

  const categories = await listCategories()

  if (!collections || !region || !categories) {
    return null
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroBanner collections={collections} />
      
      <FeaturedCollections collections={collections} />
      
      <PromotionalBanners />
      
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeaturedProducts collections={collections} region={region} />
        </div>
      </section>
    </div>
  )
}
