import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="border-t border-primary-200 bg-primary-50 w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-8 xsmall:flex-row items-start justify-between py-16">
          <div>
            <LocalizedClientLink
              href="/"
              className="text-2xl font-bold text-primary-900 hover:text-accent-600 transition-colors duration-200"
            >
              Store
            </LocalizedClientLink>
            <p className="text-primary-600 mt-2 max-w-xs">
              Quality products for everyone
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-3">
                <span className="font-semibold text-primary-900">
                  Categories
                </span>
                <ul className="flex flex-col gap-2">
                  {productCategories?.slice(0, 5).map((c) => {
                    if (c.parent_category) return null
                    return (
                      <li key={c.id}>
                        <LocalizedClientLink
                          className="text-primary-600 hover:text-accent-600 transition-colors duration-200 text-sm"
                          href={`/categories/${c.handle}`}
                        >
                          {c.name}
                        </LocalizedClientLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            
            <div className="flex flex-col gap-y-3">
              <span className="font-semibold text-primary-900">
                Quick Links
              </span>
              <ul className="flex flex-col gap-2">
                <li>
                  <LocalizedClientLink
                    className="text-primary-600 hover:text-accent-600 transition-colors duration-200 text-sm"
                    href="/account"
                  >
                    Account
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="text-primary-600 hover:text-accent-600 transition-colors duration-200 text-sm"
                    href="/cart"
                  >
                    Cart
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    className="text-primary-600 hover:text-accent-600 transition-colors duration-200 text-sm"
                    href="/help"
                  >
                    Help
                  </LocalizedClientLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center py-6 border-t border-primary-200">
          <p className="text-primary-600 text-sm">
            © {new Date().getFullYear()} Store. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a
              href="/privacy"
              className="text-primary-600 hover:text-accent-600 transition-colors duration-200 text-sm"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="text-primary-600 hover:text-accent-600 transition-colors duration-200 text-sm"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
