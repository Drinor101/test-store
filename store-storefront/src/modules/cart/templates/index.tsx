import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="py-12 bg-primary-50 min-h-screen">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-primary-900 mb-8 text-center">
              Shopping Cart
            </h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
              <div className="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
                {!customer && (
                  <>
                    <SignInPrompt />
                    <Divider />
                  </>
                )}
                <ItemsTemplate cart={cart} />
              </div>
              
              <div className="lg:sticky lg:top-8">
                <div className="bg-white rounded-lg shadow-sm border border-primary-200 p-6">
                  {cart && cart.region && (
                    <Summary cart={cart as any} />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto text-center">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
