import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "Organic Farming Workshop",
    description: "Learn to Earn 1 lakh per acre per month",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    href: "/pages/faas/organic-farming-workshop",
  },
  {
    title: "Be The Organic Farmer",
    description: "Root to Harvest: Your Guided Journey",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
    href: "/pages/faas/be-the-organic-farmer",
  },
  {
    title: "Agriculture 360",
    description: "Know Before You Grow",
    image: "https://images.unsplash.com/photo-1574943320219-553eb2136f13?w=400&h=300&fit=crop",
    href: "/pages/faas/agriculture-360",
  },
  {
    title: "Harvest Festival",
    description: "Experience the authentic harvesting with traditional touch",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop",
    href: "/pages/faas/harvest-festival",
  },
  {
    title: "Sweat Donation",
    description: "Hands-on experience in growing your own food",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
    href: "/pages/faas/sweat-donation",
  },
];

export default function FaaSPage() {
  return (
    <div className="bg-white font-body">
      <main>
        <div className="container mx-auto px-5 py-16 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-dark-gray mb-6">
              Farming As A Service (FaaS) by EverSol
            </h1>
            <p className="text-lg text-medium-gray max-w-3xl mx-auto leading-relaxed">
              Turn your curiosity into cultivation. Learn, explore, and live organic. At EverSol, we've created a path for everyone—urban professionals, NRI's, curious beginners, aspiring farmers, or anyone who wants to reconnect with the soil. Our FaaS programs are divided into two categories:
            </p>
          </div>

          {/* Our Signature Services Section */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-green text-center mb-12">
              Our Signature Services
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Link
                  key={service.title}
                  href={service.href}
                  className="group bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300"
                >
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-dark-gray mb-3">
                      {service.title}
                    </h3>
                    <p className="text-medium-gray text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center mt-16">
            <p className="text-medium-gray mb-8">
              For bulk bookings or customized requirements, feel free to reach out to us directly.
            </p>
            <a
              href="tel:+919590922000"
              className="inline-flex items-center text-primary-green font-semibold text-lg"
            >
              Contact Us: +91 9590922000
            </a>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
