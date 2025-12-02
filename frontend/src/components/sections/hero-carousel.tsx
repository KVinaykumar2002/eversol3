"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const carouselSlides = [
  {
    desktopImage:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/Banner_CoSo_member-3.jpg",
    mobileImage:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/Banner_CoSo_member-mobile_1_5x-6.png",
    alt: "Become a Co-Op Member offer banner",
    href: "/pages/membership",
    cta: {
      text: "Join Now",
      positionClasses: "bottom-[15%] left-[9%]",
    },
  },
  {
    desktopImage:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/HP_Paneer_Website_Banner-_Mumbai_Zama_Organic_Size-2.jpg",
    mobileImage:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/Paneer_website_banner-mobile__2x_3x_3x_1_5x-8.png",
    alt: "Organic Paneer promotional banner",
    href: "#",
    cta: null,
  },
  {
    desktopImage:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/199_trail_banner_1-4.jpg",
    mobileImage:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/Rs199_trail_Co-Op_banner_mobile_1_5x-7.png",
    alt: "Rs. 199 trial offer banner",
    href: "/pages/membership",
    cta: null, // CTA is baked into the image
  },
  {
    desktopImage:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/Untitled-1_1-5.png",
    mobileImage:
      "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/Untitled-1_1-5.png",
    alt: "Pure Chocolate Bliss promotion",
    href: "#",
    cta: null,
  },
];

const HeroCarousel = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section
      className="group relative w-full"
      aria-roledescription="carousel"
      aria-label="Promotional Banners"
    >
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
        opts={{
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {carouselSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <Link href={slide.href}>
                <div className="relative w-full aspect-[768/400] md:aspect-[1920/600]">
                  <div className="md:hidden">
                    <Image
                      src={slide.mobileImage}
                      alt={slide.alt}
                      fill
                      priority={index === 0}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 0"
                    />
                  </div>
                  <div className="hidden md:block">
                    <Image
                      src={slide.desktopImage}
                      alt={slide.alt}
                      fill
                      priority={index === 0}
                      className="object-cover"
                      sizes="(min-width: 769px) 100vw, 0"
                    />
                  </div>
                  {slide.cta && (
                    <div className={`absolute ${slide.cta.positionClasses}`}>
                      <Button
                        asChild
                        className="h-auto rounded-[4px] bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.5px] text-primary-foreground shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:bg-[#0a3d31] md:px-8 md:py-4 md:text-base"
                        aria-label={slide.cta.text}
                      >
                        <span tabIndex={-1}>{slide.cta.text}</span>
                      </Button>
                    </div>
                  )}
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 opacity-0 transition-opacity group-hover:opacity-100 md:left-4 md:h-12 md:w-12" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 opacity-0 transition-opacity group-hover:opacity-100 md:right-4 md:h-12 md:w-12" />
      </Carousel>

      <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2">
        <div className="flex items-center justify-center gap-2">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                current === index
                  ? "bg-stone-800"
                  : "border border-stone-800 bg-transparent"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;