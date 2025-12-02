"use client";

import * as React from "react";
import Image from "next/image";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addToCartDirect, type Product as CartProduct, type ProductVariant as CartProductVariant } from "@/lib/cart-functionality";

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  coopPrice: number;
  stock: number;
}

interface Product {
  id: string;
  title: string;
  imageUrl: string;
  variants: ProductVariant[];
  isNew?: boolean;
  description?: string;
}

interface ProductDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onAddToCart?: (variantId: string, quantity: number) => void;
}

export default function ProductDetailsModal({
  open,
  onOpenChange,
  product,
  onAddToCart,
}: ProductDetailsModalProps) {
  const [selectedVariantId, setSelectedVariantId] = React.useState<string>("");
  const [quantity, setQuantity] = React.useState(1);
  const [isAdding, setIsAdding] = React.useState(false);

  React.useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
      setQuantity(1);
    }
  }, [product, open]);

  if (!product) return null;

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const isSoldOut = !selectedVariant || selectedVariant.stock <= 0;
  const onSale = selectedVariant && typeof selectedVariant.salePrice === 'number' && selectedVariant.salePrice < selectedVariant.price;
  const displayPrice = onSale && selectedVariant.salePrice ? selectedVariant.salePrice : selectedVariant.price;
  const totalPrice = displayPrice * quantity;
  const totalCoopPrice = selectedVariant.coopPrice * quantity;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(selectedVariant.stock, quantity + delta));
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || isSoldOut) return;

    setIsAdding(true);
    
    try {
      // Check authentication first
      const { checkAuth } = await import('@/lib/auth-utils');
      const user = await checkAuth();
      
      if (!user || user.role !== 'user') {
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: { message: 'Please login to add items to cart', type: 'error' },
          })
        );
        // Redirect to login with current page as redirect
        if (typeof window !== 'undefined') {
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
        }
        setIsAdding(false);
        return;
      }

      // Create product data structure
      const productData: CartProduct = {
        id: product.id,
        name: product.title,
        imageUrl: product.imageUrl,
        variants: [{
          id: selectedVariant.id,
          name: selectedVariant.name,
          price: selectedVariant.price,
          coopPrice: selectedVariant.coopPrice,
          stock: selectedVariant.stock,
        } as CartProductVariant],
      };
      
      const result = await addToCartDirect(productData, selectedVariant.id, quantity);

      if (result.success) {
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: { message: 'Item(s) successfully added to the cart', type: 'success' },
          })
        );
        
        // Call the callback if provided
        if (onAddToCart) {
          onAddToCart(selectedVariant.id, quantity);
        }
        
        onOpenChange(false);
      } else {
        if (result.requiresAuth) {
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
          }
        } else {
          window.dispatchEvent(
            new CustomEvent('show-toast', {
              detail: { message: result.message || 'Failed to add to cart', type: 'error' },
            })
          );
        }
      }
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent('show-toast', {
          detail: { message: 'An error occurred while adding to cart', type: 'error' },
        })
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-[900px] p-0 overflow-hidden shadow-lg rounded-xl w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8">
          {/* Product Image */}
          <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-50">
            <Image
              src={product.imageUrl}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {onSale && (
              <span className="absolute top-3 left-3 bg-red-alert-alt text-white text-xs font-semibold tracking-wide px-2 py-1 rounded-sm z-10">
                SALE
              </span>
            )}
            {product.isNew && (
              <span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold tracking-wide px-2 py-1 rounded-sm z-10">
                NEW
              </span>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col space-y-4">
            <DialogHeader className="p-0 text-left">
              <DialogTitle className="text-2xl md:text-3xl font-semibold text-dark-gray mb-2">
                {product.title}
              </DialogTitle>
            </DialogHeader>

            {product.description && (
              <p className="text-sm text-medium-gray leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Variant Selection */}
            {product.variants.length > 1 && (
              <div>
                <label className="text-sm font-medium text-dark-gray mb-2 block">
                  Select Variant
                </label>
                <Select
                  value={selectedVariantId}
                  onValueChange={setSelectedVariantId}
                  disabled={isSoldOut}
                >
                  <SelectTrigger className="w-full h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.name} - ₹{variant.salePrice && variant.salePrice < variant.price 
                          ? variant.salePrice.toFixed(2) 
                          : variant.price.toFixed(2)}
                        {variant.stock <= 0 && " (Out of Stock)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Price Display */}
            <div className="space-y-2 py-4 border-t border-b border-border-gray-alt">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-dark-gray">
                  ₹{displayPrice.toFixed(2)}
                </span>
                {onSale && selectedVariant.salePrice && (
                  <span className="text-lg text-medium-gray line-through">
                    ₹{selectedVariant.price.toFixed(2)}
                  </span>
                )}
                {onSale && (
                  <span className="text-sm font-semibold text-red-alert">
                    Save ₹{(selectedVariant.price - displayPrice).toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-primary-green">
                ₹{selectedVariant.coopPrice.toFixed(2)} for Co-Op Members*
              </p>
              <p className="text-xs text-medium-gray">
                Stock: {selectedVariant.stock > 0 ? `${selectedVariant.stock} available` : 'Out of Stock'}
              </p>
            </div>

            {/* Quantity Selection */}
            {!isSoldOut && (
              <div>
                <label className="text-sm font-medium text-dark-gray mb-2 block">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-border-gray-alt rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= selectedVariant.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-medium-gray">
                    Max: {selectedVariant.stock}
                  </div>
                </div>
              </div>
            )}

            {/* Total Price */}
            {!isSoldOut && quantity > 1 && (
              <div className="bg-light-green/30 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-dark-gray">Subtotal ({quantity} items):</span>
                  <span className="text-lg font-bold text-dark-gray">₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-medium-gray">Co-Op Member Total:</span>
                  <span className="text-sm font-semibold text-primary-green">₹{totalCoopPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="pt-4 space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={isSoldOut || isAdding}
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold"
              >
                {isAdding ? (
                  "Adding to Cart..."
                ) : isSoldOut ? (
                  "Out of Stock"
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              {selectedVariant.stock > 0 && selectedVariant.stock < 10 && (
                <p className="text-xs text-red-alert text-center">
                  Only {selectedVariant.stock} left in stock!
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


