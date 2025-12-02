"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CreditCard, MapPin, Phone, Mail, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  getCartState, 
  getCartUpdateEventName,
  isCartValidForCheckout,
  type Cart,
  type CartItem
} from "@/lib/cart-functionality";
import { checkAuth } from "@/lib/auth-utils";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod", // cod = Cash on Delivery
  });

  const loadCart = () => {
    if (typeof window !== 'undefined') {
      const cartState = getCartState();
      setCart(cartState);
      setIsLoading(false);
      
      // Validate cart
      const validation = isCartValidForCheckout();
      if (!validation.isValid) {
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: { message: validation.message || 'Cart is invalid', type: 'error' },
          })
        );
        router.push('/cart');
      }
    }
  };

  useEffect(() => {
    // Check authentication first
    const checkAuthentication = async () => {
      try {
        const user = await checkAuth();
        if (!user || user.role !== 'user') {
          // Redirect to login if not authenticated
          router.push('/login?redirect=/checkout');
          return;
        }
        setIsCheckingAuth(false);
        loadCart();
      } catch (error) {
        router.push('/login?redirect=/checkout');
      }
    };

    checkAuthentication();

    const eventName = getCartUpdateEventName();
    const handleCartUpdate = () => {
      loadCart();
    };

    window.addEventListener(eventName, handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    return () => {
      window.removeEventListener(eventName, handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // In a real app, you would send this data to your backend API
    console.log('Order submitted:', {
      cart,
      shippingInfo: formData,
    });

    // Show success message
    window.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: { 
          message: 'Order placed successfully! You will receive a confirmation email shortly.', 
          type: 'success' 
        },
      })
    );

    // Redirect to order confirmation page (or home)
    router.push('/');
  };

  if (isCheckingAuth || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-5 py-16 lg:px-10">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-dark-gray mb-8">Checkout</h1>
            <div className="text-center py-12">
              <p className="text-medium-gray">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-5 py-16 lg:px-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-dark-gray mb-4">Your Cart is Empty</h1>
            <p className="text-lg text-medium-gray mb-8">
              Please add items to your cart before proceeding to checkout.
            </p>
            <Link href="/cart">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold px-8 py-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-5 py-16 lg:px-10">
        <div className="max-w-6xl mx-auto">
          <Link href="/cart" className="inline-flex items-center text-primary-green font-semibold mb-8 hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>

          <h1 className="text-4xl font-bold text-dark-gray mb-8">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Information */}
                <div className="bg-white border border-border-gray-alt rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-primary-green" />
                    <h2 className="text-xl font-semibold text-dark-gray">Shipping Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-dark-gray mb-2 block">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-dark-gray mb-2 block">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="Enter your last name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-dark-gray mb-2 block">
                        Email Address *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-10"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-dark-gray mb-2 block">
                        Phone Number *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-medium-gray" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full pl-10"
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="address" className="text-sm font-medium text-dark-gray mb-2 block">
                        Address *
                      </Label>
                      <textarea
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
                        placeholder="Enter your complete address"
                      />
                    </div>

                    <div>
                      <Label htmlFor="city" className="text-sm font-medium text-dark-gray mb-2 block">
                        City *
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="Enter your city"
                      />
                    </div>

                    <div>
                      <Label htmlFor="state" className="text-sm font-medium text-dark-gray mb-2 block">
                        State *
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        type="text"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="Enter your state"
                      />
                    </div>

                    <div>
                      <Label htmlFor="pincode" className="text-sm font-medium text-dark-gray mb-2 block">
                        Pincode *
                      </Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full"
                        placeholder="560001"
                        pattern="[0-9]{6}"
                        maxLength={6}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white border border-border-gray-alt rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-5 h-5 text-primary-green" />
                    <h2 className="text-xl font-semibold text-dark-gray">Payment Method</h2>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border border-border-gray-alt rounded-lg cursor-pointer hover:bg-light-gray transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-green focus:ring-primary-green"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-dark-gray">Cash on Delivery</div>
                        <div className="text-sm text-medium-gray">Pay when you receive your order</div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border border-border-gray-alt rounded-lg cursor-pointer hover:bg-light-gray transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="online"
                        checked={formData.paymentMethod === "online"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-green focus:ring-primary-green"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-dark-gray">Online Payment</div>
                        <div className="text-sm text-medium-gray">Pay securely with card, UPI, or wallet</div>
                      </div>
                      <Lock className="w-4 h-4 text-medium-gray" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-border-gray-alt rounded-lg p-6 sticky top-4">
                  <h2 className="text-xl font-semibold text-dark-gray mb-6">Order Summary</h2>

                  {/* Cart Items */}
                  <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                    {cart.items.map((item: CartItem) => {
                      const effectivePrice = cart.isCoOpMember ? item.coopPrice : item.price;
                      const lineTotal = item.quantity * effectivePrice;

                      return (
                        <div key={item.id} className="flex gap-3 pb-4 border-b border-border-gray-alt last:border-0">
                          <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-light-gray">
                            <Image
                              src={item.productImage || '/placeholder-product.jpg'}
                              alt={item.productName}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-dark-gray mb-1 line-clamp-1">
                              {item.productName}
                            </h3>
                            <p className="text-xs text-medium-gray mb-1">
                              {item.variantName} × {item.quantity}
                            </p>
                            <p className="text-sm font-semibold text-dark-gray">
                              ₹{lineTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Totals */}
                  <div className="space-y-3 mb-6 pt-4 border-t border-border-gray-alt">
                    <div className="flex justify-between text-medium-gray">
                      <span>Items ({cart.itemCount})</span>
                      <span>₹{cart.subtotal.toFixed(2)}</span>
                    </div>

                    {cart.discount.amount > 0 && (
                      <div className="flex justify-between text-primary-green">
                        <span>Discount ({cart.discount.code})</span>
                        <span>-₹{cart.discount.amount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-medium-gray">
                      <span>Tax</span>
                      <span>₹{cart.tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-medium-gray">
                      <span>Shipping</span>
                      <span className="text-primary-green">Free</span>
                    </div>

                    <div className="border-t border-border-gray-alt pt-4">
                      <div className="flex justify-between text-lg font-bold text-dark-gray">
                        <span>Total</span>
                        <span>₹{cart.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold py-6"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Place Order
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-medium-gray text-center mt-4">
                    By placing this order, you agree to our Terms & Conditions
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

