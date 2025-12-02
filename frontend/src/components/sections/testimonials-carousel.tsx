"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  name: string;
  title?: string;
  avatarInitial: string;
  avatarBgColor: string;
  avatarTextColor: string;
};

const testimonials: Testimonial[] = [
  {
    quote: "I love the consistency. I always get the products from EverSol as the quality is consistent. It's been the same for so many years. Many people tell me it's all the same, whether organic or not. But, I feel the difference because I use it myself.",
    name: "Jayanthi",
    avatarInitial: "J",
    avatarBgColor: "bg-orange-100",
    avatarTextColor: "text-orange-800",
  },
  {
    quote: "Usually we don't come here. But when we came to know that all the products are organic and have no chemicals, we started to come here. The fruits and vegetables are really good. Moreover, this helps the local farmers a lot. That's why we now choose EverSol.",
    name: "Kumar",
    avatarInitial: "K",
    avatarBgColor: "bg-blue-100",
    avatarTextColor: "text-blue-800",
  },
  {
    quote: "Actually, I found the EverSol store some six or seven years ago when I went to Mysore with my family. Then one of my friends told me that they have an outlet here in Indiranagar. Since that day, I have come here frequently. Their ghee, I love it. I also buy oil, pulses and millet products from here.",
    name: "Padma",
    avatarInitial: "P",
    avatarBgColor: "bg-pink-100",
    avatarTextColor: "text-pink-800",
  },
  {
    quote: "So one of my friends, she's a gym-freak and into high protein diet. She asked me to use EverSol products. It's very organic and wholesome in nature. My favorite product, it's high protein paneer because it's made of A2 milk and curd only.",
    name: "Dipti",
    avatarInitial: "D",
    avatarBgColor: "bg-teal-100",
    avatarTextColor: "text-teal-800",
  },
  {
    quote: "My wife D.Prema was heavily diabetic for over 30 years. She also had hypertension, high blood pressure, and thyroid issues. She was on heavy medication for many years, popping in some eight pills daily. She was slated to start insulin injections soon. All this catalyzed her desire to change her lifestyle drastically some five years ago.",
    name: "D.V.R. Seshadri",
    title: "Professor of Practice (Marketing Area), Indian School of Business, Hyderabad",
    avatarInitial: "D",
    avatarBgColor: "bg-indigo-100",
    avatarTextColor: "text-indigo-800",
  },
];

const scrollAnimation = (direction: "left" | "right" = "left") => ({
  animate: {
    x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
  },
  transition: {
    duration: 30,
    ease: "linear",
    repeat: Infinity,
    repeatType: "loop" as const,
  },
});

export default function TestimonialsCarousel() {
  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials = testimonials && testimonials.length > 0 
    ? [...testimonials, ...testimonials] 
    : [];

  return (
    <section className="w-full py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary-green">
          What Our Customers Say
        </h2>

        {/* Row 1 (Left Direction) */}
        <motion.div
          className="flex gap-6 mb-8"
          {...scrollAnimation("left")}
          style={{ willChange: "transform" }}
        >
          {duplicatedTestimonials.map((testimonial, i) => (
            <div
              key={`left-${testimonial.name}-${i}`}
              className="min-w-[320px] md:min-w-[380px] bg-[#f0f9f6] border border-primary-green/20 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start gap-1 mb-3">
                <span className="text-3xl font-serif text-primary-green/30 leading-none">"</span>
                <p className="text-sm md:text-base text-dark-gray leading-relaxed flex-1">
                  {testimonial.quote}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-primary-green/10">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm",
                    testimonial.avatarBgColor,
                    testimonial.avatarTextColor
                  )}
                >
                  {testimonial.avatarInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark-gray text-sm">
                    {testimonial.name}
                  </p>
                  {testimonial.title && (
                    <p className="text-xs text-medium-gray mt-0.5 line-clamp-1">
                      {testimonial.title}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Row 2 (Right Direction) */}
        <motion.div
          className="flex gap-6"
          {...scrollAnimation("right")}
          style={{ willChange: "transform" }}
        >
          {duplicatedTestimonials.map((testimonial, i) => (
            <div
              key={`right-${testimonial.name}-${i}`}
              className="min-w-[320px] md:min-w-[380px] bg-[#f0f9f6] border border-primary-green/20 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start gap-1 mb-3">
                <span className="text-3xl font-serif text-primary-green/30 leading-none">"</span>
                <p className="text-sm md:text-base text-dark-gray leading-relaxed flex-1">
                  {testimonial.quote}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-primary-green/10">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm",
                    testimonial.avatarBgColor,
                    testimonial.avatarTextColor
                  )}
                >
                  {testimonial.avatarInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark-gray text-sm">
                    {testimonial.name}
                  </p>
                  {testimonial.title && (
                    <p className="text-xs text-medium-gray mt-0.5 line-clamp-1">
                      {testimonial.title}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
