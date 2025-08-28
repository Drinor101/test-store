"use client"

import { useState, useEffect } from "react"
import { ShoppingBagIcon, UserIcon } from "@heroicons/react/24/outline"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MegaMenu from "./mega-menu"
import SearchBar from "./search-bar"
import MobileMenu from "./mobile-menu"
import CartDropdown from "@modules/layout/components/cart-dropdown"
import { HttpTypes } from "@medusajs/types"

interface EnhancedHeaderProps {
  categories: HttpTypes.StoreProductCategory[]
  cart?: HttpTypes.StoreCart | null
}

export default function EnhancedHeader({ categories, cart }: EnhancedHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-sm shadow-md" 
          : "bg-white"
      }`}
    >
      {/* Top banner */}
      <div className="bg-indigo-600 text-white text-center py-2 text-sm">
        Free shipping on orders over €50 | 30-day returns
      </div>

      {/* Main header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu button */}
            <MobileMenu categories={categories} />

            {/* Logo */}
            <div className="flex-shrink-0">
              <LocalizedClientLink href="/" className="flex items-center">
                <span className="text-2xl font-bold text-indigo-600">
                  Store
                </span>
              </LocalizedClientLink>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex lg:space-x-8">
              <MegaMenu categories={categories} />
            </nav>

            {/* Search bar */}
            <SearchBar />

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              <LocalizedClientLink
                href="/account"
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <UserIcon className="h-6 w-6" />
              </LocalizedClientLink>

              <div className="relative">
                <CartDropdown cart={cart} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}