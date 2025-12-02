"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { addToCartDirect, Product, ProductVariant } from '@/lib/cart-functionality';
import ProductDetailsModal from '@/components/ui/product-details-modal';

interface Product {
  id: number;
  name: string;
  image: string;
  dealPrice: number;
  originalPrice: number;
  coopPrice: string;
  discount: number;
  sold: number;
  total: number;
  weight: string;
}

const deals: Product[] = [
  { id: 1, name: "Organic Foxtail Millet (Navane)", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop", dealPrice: 110.00, originalPrice: 125.00, coopPrice: "₹ 93.50 for Co-Op Members*", discount: 12, sold: 75, total: 100, weight: "500g" },
  { id: 2, name: "Organic Little Millet (Saame)", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop", dealPrice: 108.00, originalPrice: 130.00, coopPrice: "₹ 91.80 for Co-Op Members*", discount: 17, sold: 45, total: 100, weight: "500g" },
  { id: 3, name: "Organic Finger Millet (Ragi)", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop", dealPrice: 115.00, originalPrice: 135.00, coopPrice: "₹ 97.75 for Co-Op Members*", discount: 15, sold: 90, total: 120, weight: "1kg" },
  { id: 4, name: "Organic Kodo Millet (Harka)", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop", dealPrice: 112.00, originalPrice: 140.00, coopPrice: "₹ 95.20 for Co-Op Members*", discount: 20, sold: 30, total: 100, weight: "500g" },
  { id: 5, name: "Organic Barnyard Millet (Udala)", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop", dealPrice: 146.00, originalPrice: 160.00, coopPrice: "₹ 124.10 for Co-Op Members*", discount: 9, sold: 65, total: 100, weight: "500g" },
];

const padZero = (num: number) => num.toString().padStart(2, '0');

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(24, 0, 0, 0);
    const difference = endOfDay.getTime() - now.getTime();

    if (difference > 0) {
      return {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isExpired = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="flex items-center gap-2">
      {isExpired ? (
        <span className="text-red-600 font-semibold">Deal Expired</span>
      ) : (
        <>
          <div className="bg-red-50 text-red-600 rounded-md px-2 py-1 text-center font-mono">
            <div className="font-bold text-lg">{padZero(timeLeft.hours)}</div>
            <div className="text-xs">Hours</div>
          </div>
          <span className="text-red-600 font-bold">:</span>
          <div className="bg-red-50 text-red-600 rounded-md px-2 py-1 text-center font-mono">
            <div className="font-bold text-lg">{padZero(timeLeft.minutes)}</div>
            <div className="text-xs">Mins</div>
          </div>
          <span className="text-red-600 font-bold">:</span>
          <div className="bg-red-50 text-red-600 rounded-md px-2 py-1 text-center font-mono">
            <div className="font-bold text-lg">{padZero(timeLeft.seconds)}</div>
            <div className="text-xs">Secs</div>
          </div>
        </>
      )}
    </div>
  );
};

const DealProductCard = ({ product }: { product: Product }) => {
  const progressPercentage = (product.sold / product.total) * 100;
  const [selectedWeight, setSelectedWeight] = useState(product.weight);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = () => {
    setIsModalOpen(true);
  };

  // Convert deal product to modal format
  const getModalProduct = () => {
    const productId = `prod-deal-${product.id}`;
    
    // Extract coop price from string (e.g., "₹ 93.50 for Co-Op Members*" -> 93.50)
    const coopPriceMatch = product.coopPrice.match(/[\d.]+/);
    const coopPrice = coopPriceMatch ? parseFloat(coopPriceMatch[0]) : product.dealPrice * 0.85;

    return {
      id: productId,
      title: product.name,
      imageUrl: product.image,
      variants: [{
        id: `var-deal-${product.id}-${product.weight}`,
        name: product.weight,
        price: product.originalPrice, // Regular price
        salePrice: product.dealPrice, // Deal price as sale price
        coopPrice: coopPrice,
        stock: product.total - product.sold,
      }],
    };
  };
  
  return (
    <div className="relative group bg-white border border-border-gray-alt rounded-lg p-4 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div>
        <div className="absolute top-0 left-0 bg-red-alert text-white text-xs font-bold uppercase py-1 px-3 rounded-tl-lg rounded-br-lg z-10">DEAL</div>
        <div className="absolute top-2 right-2 bg-red-alert-alt text-white text-xs font-bold w-10 h-10 rounded-full flex items-center justify-center z-10">
          {product.discount}% OFF
        </div>
        <a href="#" className="block aspect-square overflow-hidden rounded-md mb-4">
          <Image
            src={product.image}
            alt={product.name}
            width={250}
            height={250}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </a>
        <h3 className="text-sm font-medium text-dark-gray-alt mb-2 h-10">{product.name}</h3>
        <div className="flex items-baseline mb-2">
          <span className="text-2xl font-bold text-red-alert-alt">₹{product.dealPrice.toFixed(2)}</span>
          <span className="text-sm text-medium-gray line-through ml-2">₹{product.originalPrice.toFixed(2)}</span>
        </div>
        <p className="text-xs text-primary-green italic mb-4">{product.coopPrice}</p>
        
        <div className="w-full bg-[#d4edd9] rounded-full h-2.5 mb-1">
          <div className="bg-primary-green h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <p className="text-xs text-medium-gray">{product.sold} sold / {product.total - product.sold} remaining</p>
      </div>

      <div className="flex mt-4 items-center gap-2">
        <select 
          value={selectedWeight} 
          onChange={(e) => setSelectedWeight(e.target.value)}
          className="border border-border-gray-alt rounded-md px-2 py-2.5 text-sm w-1/2 bg-white"
        >
          <option>{product.weight}</option>
        </select>
        <button 
          onClick={handleAddToCart}
          className="w-1/2 bg-primary-green text-white py-2.5 rounded-md text-sm font-semibold uppercase tracking-wider hover:bg-[#0a3d31] transition-colors duration-300 cursor-pointer"
        >
          Add
        </button>
      </div>

      <ProductDetailsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        product={getModalProduct()}
      />
    </div>
  );
};

const DealsOfDay = () => {
    return (
        <section className="py-20 bg-white">
            <div className="max-w-[1400px] mx-auto px-5 md:px-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <h2 className="text-2xl md:text-3xl font-semibold text-dark-gray-alt" style={{fontFamily: 'GT Standard, sans-serif', letterSpacing: '-0.3px', lineHeight: '1.3'}}>Deals Of The Day</h2>
                        <CountdownTimer />
                    </div>
                    <a href="/collections/om-deals" className="text-primary-green font-semibold text-sm flex items-center">
                        View All Deals
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </a>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-5 md:grid-cols-3 gap-6">
                    {deals.map(product => (
                        <DealProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DealsOfDay;