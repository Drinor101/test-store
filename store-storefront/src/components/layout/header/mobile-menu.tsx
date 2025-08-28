"use client"

import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Bars3Icon, XMarkIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

interface MobileMenuProps {
  categories: HttpTypes.StoreProductCategory[]
}

export default function MobileMenu({ categories }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const topLevelCategories = categories.filter(cat => !cat.parent_category)

  return (
    <>
      <button
        type="button"
        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        onClick={() => setIsOpen(true)}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setIsOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setIsOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-2">
                  <div className="border-b border-gray-200">
                    <div className="px-4 py-6">
                      {topLevelCategories.map((category) => (
                        <div key={category.id} className="mb-4">
                          <button
                            className="flex w-full items-center justify-between py-2 text-base font-medium text-gray-900"
                            onClick={() => 
                              setActiveCategory(
                                activeCategory === category.id ? null : category.id
                              )
                            }
                          >
                            {category.name}
                            <ChevronRightIcon
                              className={`h-5 w-5 transform transition-transform ${
                                activeCategory === category.id ? "rotate-90" : ""
                              }`}
                            />
                          </button>
                          
                          {activeCategory === category.id && category.category_children && (
                            <div className="ml-4 mt-2 space-y-2">
                              {category.category_children.map((subcategory) => (
                                <LocalizedClientLink
                                  key={subcategory.id}
                                  href={`/categories/${subcategory.handle}`}
                                  className="block py-2 text-sm text-gray-600 hover:text-gray-900"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {subcategory.name}
                                </LocalizedClientLink>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="px-4 py-6 space-y-6">
                    <LocalizedClientLink
                      href="/account"
                      className="block text-base font-medium text-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      Account
                    </LocalizedClientLink>
                    <LocalizedClientLink
                      href="/cart"
                      className="block text-base font-medium text-gray-900"
                      onClick={() => setIsOpen(false)}
                    >
                      Cart
                    </LocalizedClientLink>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}