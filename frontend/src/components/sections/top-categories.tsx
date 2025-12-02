"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  name: string;
  items: string;
  image: string;
  bgColor: string;
  href: string;
}

const categoriesData: Category[] = [
  {
    name: "Staples",
    items: "48 Items",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/1-9.png",
    bgColor: "bg-[#FBF3D4]",
    href: "#",
  },
  {
    name: "Oils",
    items: "10 Items",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/2_29d5505b-daa9-4f09-aa36-35b30477a53d-10.png",
    bgColor: "bg-[#DDEFE0]",
    href: "#",
  },
  {
    name: "Seeds",
    items: "15 Items",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/3-11.png",
    bgColor: "bg-[#FBE5E1]",
    href: "#",
  },
  {
    name: "Home Essential",
    items: "25 Items",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/1-17.png",
    bgColor: "bg-[#F1EDFC]",
    href: "#",
  },
  {
    name: "Ready To Cook",
    items: "18 Items",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/2_29d5505b-daa9-4f09-aa36-35b30477a53d-18.png",
    bgColor: "bg-[#DDEFE0]",
    href: "#",
  },
];

const CategoryCard = ({ category }: { category: Category }) => (
  <Link 
    href={category.href} 
    className={`group flex-shrink-0 w-[160px] h-[220px] md:w-[200px] md:h-[280px] rounded-xl flex flex-col items-center justify-center p-4 transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:scale-105 ${category.bgColor}`}
  >
    <div className="relative w-24 h-24 md:w-32 md:h-32 mb-3 md:mb-5">
      <Image
        src={category.image}
        alt={category.name}
        fill
        sizes="(max-width: 768px) 96px, 128px"
        style={{ objectFit: 'contain' }}
        className="transition-transform duration-300"
      />
    </div>
    <h3 className="font-semibold text-center text-base text-dark-gray-alt" style={{ fontFamily: 'var(--font-display)' }}>{category.name}</h3>
    <p className="text-sm text-medium-gray-alt mt-1" style={{ fontFamily: 'var(--font-body)' }}>{category.items}</p>
  </Link>
);


const TopCategories = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);

    const checkScrollPosition = useCallback(() => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            const atStart = scrollLeft < 5;
            const atEnd = scrollLeft + clientWidth >= scrollWidth - 5;
            if (atStart !== isAtStart) setIsAtStart(atStart);
            if (atEnd !== isAtEnd) setIsAtEnd(atEnd);
        }
    }, [isAtStart, isAtEnd]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            checkScrollPosition();
            container.addEventListener('scroll', checkScrollPosition, { passive: true });
            window.addEventListener('resize', checkScrollPosition);

            return () => {
                container.removeEventListener('scroll', checkScrollPosition);
                window.removeEventListener('resize', checkScrollPosition);
            };
        }
    }, [checkScrollPosition]);

    const handleScroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="bg-white py-12 md:py-20 font-body">
            <div className="container mx-auto px-4 md:px-10">
                <div className="flex justify-between items-center mb-6 md:mb-8">
                    <h2 className="text-3xl md:text-4xl font-semibold text-dark-gray -tracking-[0.3px]" style={{ fontFamily: 'var(--font-display)' }}>Top Categories</h2>
                    <div className="hidden md:flex items-center space-x-2">
                        <button 
                            onClick={() => handleScroll('left')} 
                            disabled={isAtStart}
                            aria-label="Scroll left"
                            className="bg-light-gray hover:bg-border-gray disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors rounded-full w-10 h-10 flex items-center justify-center text-gray-600"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={() => handleScroll('right')}
                            disabled={isAtEnd}
                            aria-label="Scroll right"
                            className="bg-light-gray hover:bg-border-gray disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors rounded-full w-10 h-10 flex items-center justify-center text-gray-600"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <div 
                        ref={scrollContainerRef} 
                        className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {categoriesData.map((category) => (
                            <CategoryCard key={category.name} category={category} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TopCategories;