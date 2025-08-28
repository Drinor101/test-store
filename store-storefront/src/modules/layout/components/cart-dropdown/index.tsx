"use client"

import { useState } from "react"
import { ShoppingBagIcon } from "@heroicons/react/24/outline"
import MiniCart from "@components/common/mini-cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

const CartDropdown = ({
  cart,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const totalItems =
    cart?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0


  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-400 hover:text-gray-500"
      >
        <ShoppingBagIcon className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>
      
      <MiniCart 
        cart={cart} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  )
}

export default CartDropdown
