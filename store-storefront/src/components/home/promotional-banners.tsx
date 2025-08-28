import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function PromotionalBanners() {
  const promotions = [
    {
      id: 1,
      title: "Summer Sale",
      subtitle: "Up to 50% off",
      description: "Limited time offer on selected items",
      image: "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      link: "/store?sale=true",
      buttonText: "Shop Sale"
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Fresh styles",
      description: "Check out our latest products",
      image: "https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      link: "/store?sort=created_at",
      buttonText: "Explore"
    }
  ]

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="relative overflow-hidden rounded-lg bg-gray-900 group"
            >
              <div className="absolute inset-0">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-900/20" />
              </div>
              <div className="relative px-8 py-12 sm:px-12 sm:py-16">
                <div className="max-w-lg">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {promo.title}
                  </h3>
                  <p className="text-xl text-gray-200 mb-2">
                    {promo.subtitle}
                  </p>
                  <p className="text-gray-300 mb-6">
                    {promo.description}
                  </p>
                  <LocalizedClientLink
                    href={promo.link}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100 transition-colors transform hover:scale-105"
                  >
                    {promo.buttonText}
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}