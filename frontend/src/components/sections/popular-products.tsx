"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { addToCartDirect, Product, ProductVariant } from '@/lib/cart-functionality';
import ProductDetailsModal from '@/components/ui/product-details-modal';
import {
  isInWishlist,
  toggleWishlist,
  getWishlistUpdateEventName,
  type WishlistItem,
} from '@/lib/wishlist-functionality';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  coOpPrice: number;
  category: string;
  variants: string[];
}

const allProducts: Product[] = [
  { id: 1, name: 'Organic Rajmudi Rice', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop', price: 152.00, coOpPrice: 129.20, category: 'Staples', variants: ['1kg'] },
  { id: 3, name: 'Organic Tur/Toor Dal', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=500&fit=crop', price: 182.00, coOpPrice: 154.70, category: 'Staples', variants: ['500g'] },
  { id: 4, name: 'Cold Pressed - Groundnut Oil', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop', price: 494.00, coOpPrice: 419.90, category: 'Cold Pressed Oils', variants: ['1L'] },
  { id: 5, name: 'Organic Groundnuts', image: 'https://images.unsplash.com/photo-1606914501446-0c2c0c0a0c0c?w=500&h=500&fit=crop', price: 185.00, coOpPrice: 157.25, category: 'Staples', variants: ['500g'] },
  { id: 6, name: 'Organic Moong Dal', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=500&fit=crop', price: 162.00, coOpPrice: 137.70, category: 'Staples', variants: ['500g'] },
  { id: 7, name: 'Cold Pressed - Coconut Oil', image: 'https://images.unsplash.com/photo-1606914469633-bd39206ea739?w=500&h=500&fit=crop', price: 110.00, coOpPrice: 93.50, category: 'Cold Pressed Oils', variants: ['200ml'] },
  { id: 8, name: 'Organic Green Gram', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=500&fit=crop', price: 182.00, coOpPrice: 154.70, category: 'Staples', variants: ['500g'] },
  { id: 9, name: 'Organic Jaggery Powder', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&h=500&fit=crop', price: 95.00, coOpPrice: 80.75, category: 'Staples', variants: ['1kg'] },
  { id: 10, name: 'Organic Kabuli Chana', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=500&fit=crop', price: 85.00, coOpPrice: 72.25, category: 'Staples', variants: ['500g'] },
  { id: 13, name: 'Organic Ragi Flour', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop', price: 260.00, coOpPrice: 221.00, category: 'Staples', variants: ['1kg'] },
  { id: 14, name: 'Multi Millet Dosa Mix', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop', price: 295.00, coOpPrice: 250.75, category: 'Staples', variants: ['500g'] },
  { id: 16, name: 'Cold Pressed- Safflower Oil', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop', price: 494.00, coOpPrice: 419.90, category: 'Cold Pressed Oils', variants: ['1L'] },
  { id: 17, name: 'Sunflower Oil - Cold Pressed', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&h=500&fit=crop', price: 455.00, coOpPrice: 386.75, category: 'Cold Pressed Oils', variants: ['1L'] },
  { id: 18, name: 'Herbal Tooth Powder', image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c1c?w=500&h=500&fit=crop', price: 120.00, coOpPrice: 102.00, category: 'Home Essentials', variants: ['100g'] },
  { id: 22, name: 'Champa Agarbatti - 12pcs', image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c1c?w=500&h=500&fit=crop', price: 50.00, coOpPrice: 43.00, category: 'Home Essentials', variants: ['12 Pcs'] },
  { id: 23, name: 'Chilli Powder', image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=500&fit=crop', price: 265.00, coOpPrice: 225.25, category: 'Staples', variants: ['100g'] },
];

const categories = ['All', 'Staples', 'Cold Pressed Oils', 'Home Essentials'];

const ProductCard = ({ product }: { product: Product }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsWishlisted(isInWishlist(`prod-${product.id}`));
  }, [product.id]);

  useEffect(() => {
    const eventName = getWishlistUpdateEventName();
    const handleUpdate = () => {
      setIsWishlisted(isInWishlist(`prod-${product.id}`));
    };
    window.addEventListener(eventName, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(eventName, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [product.id]);

  const handleWishlistToggle = () => {
    const wishlistItem: WishlistItem = {
      id: `prod-${product.id}`,
      productId: `prod-${product.id}`,
      title: product.name,
      imageUrl: product.image,
      variantId: `var-${product.id}-${selectedVariant}`,
      variantName: selectedVariant,
      price: product.price,
      coopPrice: product.coOpPrice,
    };
    toggleWishlist(wishlistItem);
  };

  const handleAddToCart = () => {
    setIsModalOpen(true);
  };

  // Convert product to modal format
  const getModalProduct = () => {
    const productId = `prod-${product.id}`;
    
    // Extract coop price - handle both number and string formats
    const coopPrice = typeof product.coOpPrice === 'number' 
      ? product.coOpPrice 
      : parseFloat(product.coOpPrice.toString().match(/[\d.]+/)?.[0] || '0') || product.price * 0.85;

    return {
      id: productId,
      title: product.name,
      imageUrl: product.image,
      variants: product.variants.map((variant) => ({
        id: `var-${product.id}-${variant}`,
        name: variant,
        price: product.price,
        coopPrice: coopPrice,
        stock: 100,
      })),
    };
  };

  return (
    <Card className="relative group overflow-hidden rounded-lg border-border-gray-alt hover:shadow-lg transition-shadow duration-300 flex flex-col bg-white">
      <CardContent className="p-0 flex flex-col flex-grow">
        <div className="relative aspect-square bg-white p-4">
          <Image
            src={product.image}
            alt={product.name}
            width={220}
            height={220}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-white rounded-full h-8 w-8 text-gray-400 hover:text-red-alert hover:bg-white focus:ring-0"
            onClick={handleWishlistToggle}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? 'text-red-alert fill-red-alert' : ''
              }`}
            />
            <span className="sr-only">Add to Wishlist</span>
          </Button>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-sm font-medium text-dark-gray-alt h-10 line-clamp-2 mb-2">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 mb-1">
            <h5 className="text-lg font-semibold text-dark-gray-alt">₹{product.price.toFixed(2)}</h5>
            {product.originalPrice && (
              <span className="text-sm text-medium-gray line-through">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-green-700 mb-4 h-8">
            ₹{product.coOpPrice.toFixed(2)} for Co-Op Members*
          </p>
          <div className="flex items-center gap-2 mt-auto">
            <Select defaultValue={product.variants[0]} onValueChange={setSelectedVariant}>
              <SelectTrigger className="w-[100px] h-9 text-xs focus:ring-ring focus:ring-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {product.variants.map((variant) => (
                  <SelectItem key={variant} value={variant} className="text-xs">
                    {variant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleAddToCart}
              className="flex-grow h-9 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold"
            >
              Add
            </Button>
          </div>
        </div>
      </CardContent>

      <ProductDetailsModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        product={getModalProduct()}
      />
    </Card>
  );
};

const ProductSkeleton = () => (
  <div className="rounded-lg border border-border-gray-alt p-4 bg-white">
    <div className="animate-pulse">
      <div className="aspect-square bg-light-gray rounded-md"></div>
      <div className="mt-4 space-y-3">
        <div className="h-4 bg-light-gray rounded w-3/4"></div>
        <div className="h-4 bg-light-gray rounded w-1/2"></div>
        <div className="h-5 bg-light-gray rounded w-1/3"></div>
        <div className="h-3 bg-light-gray rounded w-full"></div>
        <div className="flex gap-2 pt-2">
          <div className="h-9 bg-light-gray rounded w-[100px]"></div>
          <div className="h-9 bg-light-gray rounded flex-grow"></div>
        </div>
      </div>
    </div>
  </div>
);

export default function PopularProducts() {
  const [activeTab, setActiveTab] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      let productsToShow;
      if (activeTab === 'All') {
        productsToShow = allProducts;
      } else {
        productsToShow = allProducts.filter(p => p.category === activeTab);
      }
      setFilteredProducts(productsToShow);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <section className="py-12 lg:py-20 bg-white">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4 md:gap-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-semibold text-dark-gray-alt" style={{ fontFamily: 'var(--font-display)' }}>
              Popular Products
            </h2>
            <a href="#" className="text-primary-green font-semibold text-sm hidden md:block whitespace-nowrap">
              View All
            </a>
          </div>
          <div className="overflow-x-auto -mb-px">
            <ul className="flex space-x-4 sm:space-x-6 lg:space-x-8 border-b border-border-gray whitespace-nowrap">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => setActiveTab(category)}
                    className={`pb-3 cursor-pointer transition-colors relative text-base font-medium ${
                      activeTab === category ? 'text-primary' : 'text-medium-gray-alt hover:text-primary'
                    }`}
                  >
                    <span>{category}</span>
                    {activeTab === category && (
                      <span className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-primary" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {loading
            ? Array.from({ length: 10 }).map((_, i) => <ProductSkeleton key={i} />)
            : filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
    </section>
  );
}