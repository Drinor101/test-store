import { Button } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="min-h-[70vh] w-full bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
      <div className="text-center max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-primary-900 mb-6 leading-tight">
          Simple Shopping
        </h1>
        <p className="text-xl md:text-2xl text-primary-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Discover quality products with a seamless shopping experience
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="primary" 
            size="large"
            className="bg-accent-600 hover:bg-accent-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Shop Now
          </Button>
          <Button 
            variant="secondary" 
            size="large"
            className="border-2 border-primary-300 text-primary-700 hover:bg-primary-50 px-8 py-4 text-lg rounded-lg transition-all duration-300"
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Hero
