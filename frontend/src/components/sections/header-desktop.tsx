"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Phone,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategoryDropdown from "@/components/ui/category-dropdown";
import AddressDropdown from "@/components/ui/address-dropdown";
import { getCartItemCount, getCartUpdateEventName } from "@/lib/cart-functionality";
import { getWishlistCount, getWishlistUpdateEventName } from "@/lib/wishlist-functionality";
import { getSelectedAddress, getAddressUpdateEventName, type Address } from "@/lib/address-functionality";

const navLinks = [
  { href: "/pages/membership", text: "Co-Op Member" },
  { href: "/pages/faas", text: "Farming As A Service" },
  { href: "https://trust.eversol.com", text: "Lab Test Reports" },
  { href: "/pages/store-locator", text: "Store Locations" },
  { href: "/collections/om-deals", text: "Deals" },
];


const HeaderDesktop = () => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    const loadCounts = () => {
      if (typeof window !== 'undefined') {
        setCartCount(getCartItemCount());
        setWishlistCount(getWishlistCount());
        setSelectedAddress(getSelectedAddress());
      }
    };

    loadCounts();

    const cartEvent = getCartUpdateEventName();
    const wishlistEvent = getWishlistUpdateEventName();
    const addressEvent = getAddressUpdateEventName();
    const handleUpdates = () => {
      loadCounts();
    };

    window.addEventListener(cartEvent, handleUpdates);
    window.addEventListener(wishlistEvent, handleUpdates);
    window.addEventListener(addressEvent, handleUpdates);
    window.addEventListener('storage', handleUpdates);

    return () => {
      window.removeEventListener(cartEvent, handleUpdates);
      window.removeEventListener(wishlistEvent, handleUpdates);
      window.removeEventListener(addressEvent, handleUpdates);
      window.removeEventListener('storage', handleUpdates);
    };
  }, []);

  const getAddressDisplay = () => {
    if (selectedAddress) {
      return `${selectedAddress.city}, ${selectedAddress.pincode}`;
    }
    return "Select address";
  };

  return (
    <header className="hidden lg:block sticky top-[36px] z-50 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] font-display">
      <div className="container px-10">
        <div className="flex items-center justify-between h-[92px]">
          <div className="flex items-center gap-6 flex-1">
            <AddressDropdown onAddressChange={setSelectedAddress}>
              <div className="flex items-center gap-2 cursor-pointer flex-shrink-0 hover:opacity-80 transition-opacity">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/svgs/Location_4-1.svg"
                  alt="Location Icon"
                  width={16}
                  height={20}
                />
                <div className="flex items-center text-sm">
                  <span className="text-medium-gray mr-1">Deliver to</span>
                  <span className="text-dark-gray font-medium mr-1">{getAddressDisplay()}</span>
                  <ChevronDown className="h-4 w-4 text-dark-gray" />
                </div>
              </div>
            </AddressDropdown>
            
            <form className="flex items-center border border-border-gray-alt rounded h-11 w-full max-w-xs">
               <Input
                type="text"
                placeholder="organic"
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full flex-grow pl-4"
              />
              <div className="border-l border-border-gray-alt h-full flex items-center">
                <Button type="submit" variant="ghost" size="icon" className="h-full w-12 hover:bg-gray-100 rounded-none rounded-r-[3px]">
                  <Search className="h-5 w-5 text-dark-gray" />
                </Button>
              </div>
            </form>
          </div>

          <div className="px-8 flex-shrink-0">
            <Link href="/">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/OM_Logo_2-1.png"
                alt="EverSol Logo"
                width={136}
                height={91}
                priority
                className="h-auto"
              />
            </Link>
          </div>

          <div className="flex items-center justify-end gap-6 flex-1">
            <Link href="/wishlist" className="relative flex items-center gap-2 text-dark-gray-alt hover:text-primary-green transition-colors">
              <div className="relative">
              <Heart className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-green text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">Wishlist</span>
            </Link>
            <Link href="/cart" className="relative flex items-center gap-2 text-dark-gray-alt hover:text-primary-green transition-colors">
              <div className="relative">
              <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-green text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium">Cart</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/register"
                className="flex items-center gap-2 text-dark-gray-alt hover:text-primary-green transition-colors"
              >
                <span className="text-sm font-medium">Register</span>
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 text-dark-gray-alt hover:text-primary-green transition-colors"
              >
                <User className="h-6 w-6" />
                <span className="text-sm font-medium">Log in</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border-gray">
        <div className="container px-10 flex items-center justify-between h-[60px]">
          <CategoryDropdown />

          <nav>
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.text}>
                  <Link href={link.href} target={link.href.startsWith('http') ? '_blank' : '_self'} rel={link.href.startsWith('http') ? 'noopener noreferrer' : ''} className="text-sm font-semibold text-dark-gray-alt hover:text-primary-green transition-colors">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <a href="tel:+919590922000" className="flex items-center gap-2 text-dark-gray-alt hover:text-primary-green transition-colors">
            <Phone className="h-6 w-6" />
            <div className="text-sm text-left">
              <span className="font-semibold">+91 9590922000</span>
            </div>
          </a>
        </div>
      </div>
    </header>
  );
};

export default HeaderDesktop;