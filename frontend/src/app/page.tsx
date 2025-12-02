import HeroCarousel from "@/components/sections/hero-carousel";
import TopCategories from "@/components/sections/top-categories";
import FeaturedBanners from "@/components/sections/featured-banners";
import PopularProducts from "@/components/sections/popular-products";
import LifestyleSwitch from "@/components/sections/lifestyle-switch";
import VideoTestimonial from "@/components/sections/video-testimonial";
import DealsOfDay from "@/components/sections/deals-of-day";
import CategoryShowcases from "@/components/sections/category-showcases";
import TestimonialsCarousel from "@/components/sections/testimonials-carousel";
import NewsletterSubscription from "@/components/sections/newsletter-subscription";

export default function Home() {
  return (
    <div className="bg-background font-body">
      <HeroCarousel />
      <TopCategories />
      <FeaturedBanners />
      <PopularProducts />
      <LifestyleSwitch />
      <VideoTestimonial />
      <DealsOfDay />
      <CategoryShowcases />
      <TestimonialsCarousel />
      <NewsletterSubscription />
    </div>
  );
}