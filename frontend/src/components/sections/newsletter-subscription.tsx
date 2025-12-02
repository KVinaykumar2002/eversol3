"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";

// Note: The design features a collage of floating product images.
// As no asset URLs were provided for this section, placeholder divs are used
// to replicate the layout and feel without using broken or unverified image links,
// adhering to the project's asset handling guidelines.

const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // A real implementation would handle the API call for subscription here.
    console.log("Subscribed with:", email);
    alert(`Thank you for subscribing!`);
    setEmail("");
  };

  return (
    <section className="bg-[#dff2e8] py-16 lg:py-24 overflow-hidden font-body">
      <div className="container px-5 md:px-10">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:gap-x-8">
          <div className="w-full lg:w-[55%] xl:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <h2 className="font-display font-bold text-[#1a1a1a] text-3xl md:text-4xl xl:text-[40px] leading-tight mb-4">
              Stay home &amp; get your daily needs from our shop
            </h2>
            <p className="text-[#666666] text-base md:text-lg mb-8">
              Start Your Daily Shopping with EverSol
            </p>

            <form
              onSubmit={handleSubmit}
              className="max-w-lg mx-auto lg:mx-0"
              aria-label="Newsletter subscription"
            >
              <div className="flex rounded-full shadow-lg overflow-hidden">
                <div className="relative flex-grow">
                  <label htmlFor="email-input" className="sr-only">
                    Email address
                  </label>
                  <Mail
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                    size={20}
                    aria-hidden="true"
                  />
                  <input
                    id="email-input"
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-14 pl-12 pr-4 bg-white border-0 focus:ring-2 focus:ring-primary/50 focus:outline-none text-base text-dark-gray-alt placeholder:text-medium-gray-alt relative rounded-l-full"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground font-semibold px-6 md:px-8 h-14 rounded-r-full whitespace-nowrap hover:bg-opacity-90 transition-colors duration-300 text-sm uppercase tracking-[0.5px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          <div className="w-full lg:w-[45%] xl:w-1/2 min-h-[280px] lg:min-h-[400px] relative mt-16 lg:mt-0">
            {/* Placeholder divs for floating images */}
            <div className="absolute top-[-30px] right-[10%] lg:right-[15%] w-[100px] h-[100px] lg:w-[130px] lg:h-[130px] transform rotate-[15deg] shadow-lg bg-white/40 rounded-2xl"></div>
            <div className="absolute top-[40%] right-[-20px] lg:right-0 w-[90px] h-[90px] lg:w-[120px] lg:h-[120px] transform -rotate-[25deg] shadow-lg bg-white/40 rounded-2xl"></div>
            <div className="absolute top-[-10px] left-[50%] lg:left-auto lg:top-[55%] lg:right-[30%] w-[120px] h-[120px] transform -rotate-[10deg] shadow-lg bg-white/40 rounded-2xl"></div>
            <div className="absolute bottom-[-60px] lg:bottom-[-40px] left-[5%] lg:left-[15%] w-[80px] h-[130px] transform -rotate-[10deg] shadow-lg bg-white/40 rounded-2xl"></div>
            <div className="hidden lg:block absolute bottom-[-20px] right-[5%] w-[150px] h-[150px] transform rotate-[10deg] shadow-lg bg-white/40 rounded-2xl"></div>
            <div className="absolute top-[10%] left-[5%] lg:left-[10%] w-[80px] h-[80px] transform rotate-[10deg] shadow-lg bg-white/40 rounded-2xl"></div>
            <div className="absolute bottom-0 left-[35%] lg:left-[45%] w-[90px] h-[90px] transform rotate-[20deg] shadow-lg bg-white/40 rounded-full"></div>
            <div className="absolute bottom-[20%] left-[0] w-[90px] h-[90px] transform -rotate-[15deg] shadow-lg bg-white/40 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSubscription;