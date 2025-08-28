"use client"

import { useState, useEffect, useMemo } from "react"
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline"
import ProductGrid from "@components/products/product-grid"
import FiltersSidebar, { FilterState } from "./filters-sidebar"
import { listProductsWithSort } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

interface EnhancedStoreTemplateProps {
  initialProducts: HttpTypes.StoreProduct[]
  countryCode: string
  sortBy?: SortOptions
  searchQuery?: string
}

export default function EnhancedStoreTemplate({
  initialProducts,
  countryCode,
  sortBy = "created_at",
  searchQuery
}: EnhancedStoreTemplateProps) {
  const [products, setProducts] = useState(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState(initialProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [currentSort, setCurrentSort] = useState(sortBy)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const sortOptions = [
    { value: "created_at", label: "Latest" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
  ]

  // Filter products based on filter state
  const handleFiltersChange = (filters: FilterState) => {
    const filtered = products.filter(product => {
      // Price filter
      const productPrices = product.variants?.map(v => 
        v.calculated_price?.calculated_amount || 0
      ) || [0]
      const minPrice = Math.min(...productPrices)
      const maxPrice = Math.max(...productPrices)
      
      if (minPrice < filters.priceRange[0] || maxPrice > filters.priceRange[1]) {
        return false
      }

      // Category filter
      if (filters.categories.length > 0) {
        const productCategories = product.categories?.map(c => c.name) || []
        if (!filters.categories.some(cat => productCategories.includes(cat))) {
          return false
        }
      }

      // Brand filter
      if (filters.brands.length > 0) {
        const productBrand = product.metadata?.brand as string
        if (!productBrand || !filters.brands.includes(productBrand)) {
          return false
        }
      }

      // In stock filter
      if (filters.inStock) {
        const hasStock = product.variants?.some(v => 
          !v.manage_inventory || (v.inventory_quantity || 0) > 0
        )
        if (!hasStock) return false
      }

      // On sale filter
      if (filters.onSale) {
        const isOnSale = product.variants?.some(v => 
          v.calculated_price?.price_type === "sale"
        )
        if (!isOnSale) return false
      }

      return true
    })

    setFilteredProducts(filtered)
  }

  // Load more products
  const loadMoreProducts = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const { response, nextPage } = await listProductsWithSort({
        page: currentPage + 1,
        sortBy: currentSort,
        countryCode,
        queryParams: searchQuery ? { q: searchQuery } : {}
      })

      if (response.products.length > 0) {
        setProducts(prev => [...prev, ...response.products])
        setCurrentPage(prev => prev + 1)
        setHasMore(!!nextPage)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading more products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle sort change
  const handleSortChange = async (newSort: SortOptions) => {
    setCurrentSort(newSort)
    setIsLoading(true)
    
    try {
      const { response } = await listProductsWithSort({
        page: 1,
        sortBy: newSort,
        countryCode,
        queryParams: searchQuery ? { q: searchQuery } : {}
      })
      setProducts(response.products)
      setCurrentPage(1)
      setHasMore(true)
    } catch (error) {
      console.error("Error sorting products:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {searchQuery ? `Search results for "${searchQuery}"` : "All Products"}
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredProducts.length} products found
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Sort dropdown */}
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value as SortOptions)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Mobile filter button */}
          <button
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Filters Sidebar */}
        <div className="hidden lg:block w-80 mr-8">
          <FiltersSidebar
            products={products}
            onFiltersChange={handleFiltersChange}
            isOpen={true}
            onClose={() => {}}
          />
        </div>

        {/* Mobile Filters */}
        <FiltersSidebar
          products={products}
          onFiltersChange={handleFiltersChange}
          isOpen={filtersOpen}
          onClose={() => setFiltersOpen(false)}
        />

        {/* Products Grid */}
        <div className="flex-1">
          <ProductGrid products={filteredProducts} isLoading={isLoading} />

          {/* Load More Button */}
          {hasMore && !isLoading && (
            <div className="mt-12 text-center">
              <button
                onClick={loadMoreProducts}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Load More Products
              </button>
            </div>
          )}

          {isLoading && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                <span className="text-gray-600">Loading more products...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}