"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import LottiePlayer from "@/components/ui/lottie-player";

/**
 * Co-Op Privileges with Farming Lottie Animations
 * 
 * To get farming-related Lottie animations:
 * 1. Visit https://lottiefiles.com/
 * 2. Search for: "farming", "agriculture", "farmer", "organic", "crops", "harvest", "plant growth"
 * 3. Download the JSON files or copy the CDN URLs
 * 4. Replace the lottieUrl values below with your chosen animation URLs
 * 
 * Recommended searches for each privilege:
 * - Wholesale prices: "farming produce", "basket of vegetables", "farmer market"
 * - Early access: "farming calendar", "seasonal farming", "harvest time"
 * - Farm Visits: "farm landscape", "agriculture field", "organic farm"
 * - Innovation & Growth: "plant growing", "seedling growth", "organic growth"
 * - Savings & Benefits: "farmer harvest", "farming success", "organic produce"
 * - Quality Assurance: "organic certification", "quality check", "farming quality"
 */
const coOpPrivileges = [
  {
    title: "Wholesale prices on all our products!!!",
    description: "Enjoy wholesale pricing on all organic products",
    // Farming produce basket animation - replace with your Lottie file URL
    lottieUrl: "https://assets5.lottiefiles.com/private_files/lf30_editor_8y5qjq.json",
    fallbackImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
  },
  {
    title: "Early access to Sales",
    description: "Get first access to exclusive sales and promotions",
    // Farming seasonal calendar - replace with your Lottie file URL
    lottieUrl: "https://assets5.lottiefiles.com/packages/lf20_jbrw3hcz.json",
    fallbackImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
  },
  {
    title: "Exclusive Farm Visits",
    description: "Visit our farms and see where your food comes from",
    // Farm landscape with crops - replace with your Lottie file URL
    lottieUrl: "https://assets5.lottiefiles.com/packages/lf20_jbrw3hcz.json",
    fallbackImage: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
  },
  {
    title: "Innovation & Growth",
    description: "Stay updated with the latest organic farming innovations",
    // Plant growing animation - replace with your Lottie file URL
    lottieUrl: "https://assets5.lottiefiles.com/packages/lf20_V9t630.json",
    fallbackImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
  },
  {
    title: "Savings & Benefits",
    description: "Save more with exclusive member discounts and offers",
    // Farmer with harvest - replace with your Lottie file URL
    lottieUrl: "https://assets5.lottiefiles.com/packages/lf20_qp1spzqv.json",
    fallbackImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop",
  },
  {
    title: "Quality Assurance",
    description: "Lab-tested products with certified organic standards",
    // Organic certification badge - replace with your Lottie file URL
    lottieUrl: "https://assets5.lottiefiles.com/packages/lf20_vykwnv4z.json",
    fallbackImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
  },
];

const featuredCards = [
  {
    title: "Free Organic Farming Workshops",
    description: "Learn organic farming techniques from experts",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
  },
  {
    title: "Wholesale Product Pricing",
    description: "Get the best prices on all organic products",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=300&fit=crop",
  },
  {
    title: "Certified Organic Products",
    description: "All products are lab-tested and certified organic",
    image: "https://images.unsplash.com/photo-1574943320219-553eb2136f13?w=400&h=300&fit=crop",
  },
];

const faqs = [
  {
    question: "What is the process for becoming a member?",
    answer: "Becoming a member is simple! Just click the 'Join Now' button, fill out the membership form, and complete the payment. You'll receive instant access to all member benefits.",
  },
  {
    question: "What are the benefits of our membership?",
    answer: "As a member, you'll enjoy wholesale pricing, early access to sales, exclusive farm visits, free organic farming workshops, and much more. Check out our Co-Op Privileges section for complete details.",
  },
  {
    question: "How do we deliver exceptional value while remaining affordable?",
    answer: "We work directly with farmers, eliminating middlemen, and pass the savings directly to our members. Our cooperative model ensures fair prices for both farmers and members.",
  },
  {
    question: "Are our products organic, natural, non-GMO?",
    answer: "Yes! All our products are certified organic, 100% natural, and non-GMO. We provide lab test reports for transparency and quality assurance.",
  },
  {
    question: "Do we use plastic-free packaging?",
    answer: "Absolutely! We are committed to sustainability and use eco-friendly, plastic-free packaging for all our products. We care about the environment as much as we care about your health.",
  },
];

export default function MembershipPage() {
  return (
    <div className="bg-white font-body">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop"
          alt="Farmers in field"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        
        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 z-10">
          <div className="mb-8">
            <p className="text-white text-lg md:text-xl mb-2">where every member</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-green mb-2">
              Uplifts a Farmer
            </h1>
            <div className="w-32 md:w-48 h-1 bg-yellow-400 mx-auto mt-2" />
          </div>
          
          <div className="mt-auto mb-16 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Co-Operative Society Membership
            </h2>
            <p className="text-white text-lg md:text-xl mb-6">
              Become a member today and get access to special offers
            </p>
            <Button className="bg-white text-primary-green hover:bg-white/90 text-lg font-semibold px-8 py-6 rounded-md">
              Join Now
            </Button>
          </div>
        </div>
      </section>

      <main>
        {/* Co-Op Privileges Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-5 lg:px-10">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-green text-center mb-12">
              Co-Op Privileges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {coOpPrivileges.map((privilege, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300"
                >
                  <div className="relative w-full h-48 overflow-hidden bg-gray-50 flex items-center justify-center">
                    <LottiePlayer
                      url={privilege.lottieUrl}
                      className="w-full h-full"
                      fallback={
                        <Image
                          src={privilege.fallbackImage}
                          alt={privilege.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      }
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-dark-gray mb-2">
                      {privilege.title}
                    </h3>
                    <p className="text-medium-gray text-sm">
                      {privilege.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Cards Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-5 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {featuredCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300"
                >
                  <div className="relative w-full h-64 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary-green mb-3">
                      {card.title}
                    </h3>
                    <p className="text-medium-gray text-sm">
                      {card.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-5 lg:px-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-green text-center mb-12">
                FAQs
              </h2>
              <div className="bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-semibold text-dark-gray hover:no-underline py-4">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-medium-gray pt-2 pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
