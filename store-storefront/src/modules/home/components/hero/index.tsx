import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <div className="min-h-[70vh] w-full bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Simple Shopping
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover quality products with a seamless shopping experience
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LocalizedClientLink
            href="/store"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 inline-block"
          >
            Shop Now
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/collections"
            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg rounded-lg transition-all duration-300 inline-block"
          >
            Learn More
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default Hero
