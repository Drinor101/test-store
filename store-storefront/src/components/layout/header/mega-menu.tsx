"use client"

import { Fragment, useState } from "react"
import { Popover, Transition } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

interface MegaMenuProps {
  categories: HttpTypes.StoreProductCategory[]
}

export default function MegaMenu({ categories }: MegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const topLevelCategories = categories.filter(cat => !cat.parent_category)

  return (
    <div className="hidden lg:flex lg:space-x-8">
      {topLevelCategories.map((category) => (
        <Popover key={category.id} className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                onMouseEnter={() => setActiveCategory(category.id)}
              >
                {category.name}
                <ChevronDownIcon
                  className={`ml-1 h-4 w-4 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </Popover.Button>

              <Transition
                as={Fragment}
                show={open || activeCategory === category.id}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel
                  static
                  className="absolute left-0 z-50 mt-3 w-screen max-w-md transform px-2 sm:px-0"
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                      {category.category_children?.map((subcategory) => (
                        <LocalizedClientLink
                          key={subcategory.id}
                          href={`/categories/${subcategory.handle}`}
                          className="-m-3 flex items-start rounded-lg p-3 hover:bg-gray-50"
                        >
                          <div className="ml-4">
                            <p className="text-base font-medium text-gray-900">
                              {subcategory.name}
                            </p>
                            {subcategory.description && (
                              <p className="mt-1 text-sm text-gray-500">
                                {subcategory.description}
                              </p>
                            )}
                          </div>
                        </LocalizedClientLink>
                      ))}
                      
                      <div className="border-t border-gray-200 pt-4">
                        <LocalizedClientLink
                          href={`/categories/${category.handle}`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          View all {category.name}
                        </LocalizedClientLink>
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      ))}
    </div>
  )
}