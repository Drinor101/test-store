"use client"

import { useState, useEffect } from "react"
import { HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline"
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { addToCart } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { useParams } from "next/navigation"
import { getProductPrice } from "@lib/util/get-product-price"

interface ProductGridProps {
  products: HttpTypes.StoreProduct[]
  isLoading?: boolean
}

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set())
  const { countryCode } = useParams()

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }
  }, [])

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId)
    } else {
      newFavorites.add(productId)
    }
    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify([...newFavorites]))
  }

  const handleAddToCart = async (product: HttpTypes.StoreProduct) => {
    if (!product.variants?.[0]) return

    setAddingToCart(prev => new Set(prev).add(product.id))
    
    try {
      await addToCart({
        variantId: product.variants[0].id,
        quantity: 1,
        countryCode: countryCode as string
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setAddingToCart(prev => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const { cheapestPrice } = getProductPrice({ product })
        const isAddingToCart = addingToCart.has(product.id)
        const isFavorite = favorites.has(product.id)

        return (
          <div
            key={product.id}
            className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
              <LocalizedClientLink href={`/products/${product.handle}`}>
                <img
                  src={product.thumbnail || "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=400"}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </LocalizedClientLink>

              {/* Discount badge */}
              {cheapestPrice?.price_type === "sale" && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                  -{cheapestPrice.percentage_diff}%
                </div>
              )}

              {/* Favorite button */}
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
              >
                {isFavorite ? (
                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                )}
              </button>

              {/* Quick add to cart */}
              <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={isAddingToCart || !product.variants?.[0]}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isAddingToCart ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <ShoppingCartIcon className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <LocalizedClientLink href={`/products/${product.handle}`}>
                <h3 className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2">
                  {product.title}
                </h3>
              </LocalizedClientLink>
              
              <div className="mt-2 flex items-center space-x-2">
                {cheapestPrice && (
                  <>
                    <span className="text-lg font-semibold text-gray-900">
                      {cheapestPrice.calculated_price}
                    </span>
                    {cheapestPrice.price_type === "sale" && (
                      <span className="text-sm text-gray-500 line-through">
                        {cheapestPrice.original_price}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Variants count */}
              {product.variants && product.variants.length > 1 && (
                <p className="text-xs text-gray-500 mt-1">
                  {product.variants.length} variants available
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}