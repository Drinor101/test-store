"use client"

import { useState, useEffect } from "react"
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { HttpTypes } from "@medusajs/types"

interface FiltersSidebarProps {
  products: HttpTypes.StoreProduct[]
  onFiltersChange: (filters: FilterState) => void
  isOpen: boolean
  onClose: () => void
}

export interface FilterState {
  priceRange: [number, number]
  categories: string[]
  brands: string[]
  inStock: boolean
  onSale: boolean
}

export default function FiltersSidebar({ 
  products, 
  onFiltersChange, 
  isOpen, 
  onClose 
}: FiltersSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000],
    categories: [],
    brands: [],
    inStock: false,
    onSale: false
  })

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    categories: true,
    brands: true,
    features: true
  })

  // Extract unique values from products
  const uniqueCategories = Array.from(
    new Set(
      products
        .filter(p => p.categories)
        .flatMap(p => p.categories?.map(c => c.name) || [])
    )
  )

  const uniqueBrands = Array.from(
    new Set(
      products
        .filter(p => p.metadata?.brand)
        .map(p => p.metadata?.brand as string)
    )
  )

  const priceRange = products.reduce(
    (acc, product) => {
      const prices = product.variants?.map(v => 
        v.calculated_price?.calculated_amount || 0
      ) || [0]
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      
      return [
        Math.min(acc[0], minPrice),
        Math.max(acc[1], maxPrice)
      ]
    },
    [Infinity, 0]
  )

  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const clearFilters = () => {
    setFilters({
      priceRange: [priceRange[0], priceRange[1]],
      categories: [],
      brands: [],
      inStock: false,
      onSale: false
    })
  }

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string
    section: keyof typeof expandedSections
    children: React.ReactNode 
  }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => toggleSection(section)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-medium text-gray-900">{title}</span>
        <ChevronDownIcon
          className={`h-5 w-5 transform transition-transform ${
            expandedSections[section] ? "rotate-180" : ""
          }`}
        />
      </button>
      {expandedSections[section] && (
        <div className="mt-4 space-y-3">{children}</div>
      )}
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white shadow-xl lg:shadow-none transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full overflow-y-auto">
          {/* Mobile header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={onClose} className="p-2">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4">
            {/* Clear filters */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold hidden lg:block">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Clear all
              </button>
            </div>

            {/* Price Range */}
            <FilterSection title="Price Range" section="price">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) => 
                      updateFilter("priceRange", [
                        parseInt(e.target.value) || 0,
                        filters.priceRange[1]
                      ])
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Min"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) => 
                      updateFilter("priceRange", [
                        filters.priceRange[0],
                        parseInt(e.target.value) || 1000
                      ])
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Max"
                  />
                </div>
                <input
                  type="range"
                  min={priceRange[0]}
                  max={priceRange[1]}
                  value={filters.priceRange[1]}
                  onChange={(e) => 
                    updateFilter("priceRange", [
                      filters.priceRange[0],
                      parseInt(e.target.value)
                    ])
                  }
                  className="w-full"
                />
              </div>
            </FilterSection>

            {/* Categories */}
            {uniqueCategories.length > 0 && (
              <FilterSection title="Categories" section="categories">
                <div className="space-y-2">
                  {uniqueCategories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...filters.categories, category]
                            : filters.categories.filter(c => c !== category)
                          updateFilter("categories", newCategories)
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Brands */}
            {uniqueBrands.length > 0 && (
              <FilterSection title="Brands" section="brands">
                <div className="space-y-2">
                  {uniqueBrands.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand)}
                        onChange={(e) => {
                          const newBrands = e.target.checked
                            ? [...filters.brands, brand]
                            : filters.brands.filter(b => b !== brand)
                          updateFilter("brands", newBrands)
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Features */}
            <FilterSection title="Features" section="features">
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => updateFilter("inStock", e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.onSale}
                    onChange={(e) => updateFilter("onSale", e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">On Sale</span>
                </label>
              </div>
            </FilterSection>
          </div>
        </div>
      </div>
    </>
  )
}