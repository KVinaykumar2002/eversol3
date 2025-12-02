"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ArrowLeft } from "lucide-react";
import ProductCard from "@/components/ui/product-card";
import { addToCart } from "@/lib/cart-functionality";

type PageProps = {
  params: Promise<{ category: string }>;
};

// Mock products data - in a real app, this would come from an API
const mockProductsByCategory: Record<string, any[]> = {
  "dals-pulses": [
    {
      id: "prod-3",
      title: "Organic Tur/Toor Dal",
      imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=500&fit=crop",
      variants: [
        { id: "var-3-2", name: "1kg", price: 350.00, coopPrice: 297.50, stock: 15 },
      ],
    },
    {
      id: "prod-6",
      title: "Organic Moong Dal",
      imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500&h=500&fit=crop",
      variants: [
        { id: "var-6-1", name: "500g", price: 162.00, coopPrice: 137.70, stock: 20 },
      ],
    },
  ],
  "dry-fruits": [
    {
      id: "prod-5",
      title: "Organic Groundnuts",
      imageUrl: "https://images.unsplash.com/photo-1606914501446-0c2c0c0a0c0c?w=500&h=500&fit=crop",
      variants: [
        { id: "var-5-1", name: "500g", price: 185.00, coopPrice: 157.25, stock: 15 },
      ],
    },
  ],
  // Add more categories as needed
};

export default function CategoryPage({ params }: PageProps) {
  const [category, setCategory] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    params.then(({ category: cat }) => {
      setCategory(cat);
      const formattedName = cat
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setCategoryName(formattedName);
      
      // Get products for this category
      const categoryProducts = mockProductsByCategory[cat] || [];
      setProducts(categoryProducts);
    });
  }, [params]);

  const handleAddToCart = async (variantId: string, quantity: number) => {
    // Find the product that contains this variant
    const product = products.find(p => 
      p.variants.some((v: any) => v.id === variantId)
    );
    
    if (product) {
      const result = await addToCart(product.id, variantId, quantity);
      if (result.success) {
        // Show success notification
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: { message: 'Item(s) successfully added to the cart', type: 'success' },
          })
        );
      } else {
        // Show error notification
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: { message: result.message, type: 'error' },
          })
        );
      }
    }
  };

  return (
    <div className="bg-background font-body">
      <div className="container mx-auto px-5 py-16 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <Link href="/" className="inline-flex items-center text-primary-green font-semibold mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>

            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-light-green mb-6">
                <Package className="w-12 h-12 text-primary-green" />
              </div>
              <h1 className="text-4xl font-bold text-dark-gray mb-4">
                {categoryName}
              </h1>
              <p className="text-lg text-medium-gray">
                Explore our organic {categoryName.toLowerCase()} collection
              </p>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 bg-light-gray rounded-lg text-center">
                <p className="text-medium-gray mb-6">
                  Products in this category are being updated. Please check back soon or browse our other collections.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link
                    href="/"
                    className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold px-8 py-3 rounded-md transition-colors"
                  >
                    Browse All Products
                  </Link>
                  <a
                    href="tel:+919590922000"
                    className="inline-block bg-white text-primary-green border-2 border-primary-green hover:bg-light-green text-sm font-semibold px-8 py-3 rounded-md transition-colors"
                  >
                    Contact Us
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
