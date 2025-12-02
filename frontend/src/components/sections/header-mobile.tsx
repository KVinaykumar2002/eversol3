"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, Heart, ShoppingCart, ChevronDown, X, User } from "lucide-react";
import { getCartItemCount, getCartUpdateEventName } from "@/lib/cart-functionality";
import { getWishlistCount, getWishlistUpdateEventName } from "@/lib/wishlist-functionality";
import AddressDropdown from "@/components/ui/address-dropdown";
import { getSelectedAddress, getAddressUpdateEventName, type Address } from "@/lib/address-functionality";

// The navItems are derived from the desktop navigation panel in the HTML structure
const navItems = [
  { name: 'Browse All Categories', href: '/collections/all' },
  { name: 'Co-Op Member', href: '/pages/membership' },
  { name: 'Farming As A Service', href: '/pages/faas' },
  { name: 'Lab Test Reports', href: 'https://trust.eversol.com', external: true },
  { name: 'Store Locations', href: '/pages/store-locator' },
  { name: 'Deals', href: '/collections/om-deals' },
];

const NavPanel = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <>
    {/* Overlay */}
    <div 
      className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-40 lg:hidden ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`}
      onClick={onClose}
      aria-hidden="true"
    />
    {/* Panel */}
    <div className={`fixed top-0 left-0 h-full w-4/5 max-w-[320px] bg-white z-50 p-5 shadow-lg transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex justify-between items-center mb-8">
        <Link href="/" onClick={onClose} className="text-xl font-bold text-primary-green">
          EverSol
        </Link>
        <button onClick={onClose} className="p-1 -mr-1 cursor-pointer" aria-label="Close menu">
          <X size={28} className="text-dark-gray"/>
        </button>
      </div>
      <nav>
        <ul className="flex flex-col">
          {navItems.map((item, index) => (
            <li key={index} className="border-b border-border-gray-alt">
              {item.external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="block py-4 text-dark-gray-alt hover:text-primary-green transition-colors">
                  {item.name}
                </a>
              ) : (
                <Link href={item.href} onClick={onClose} className="block py-4 text-dark-gray-alt hover:text-primary-green transition-colors">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
          <li className="border-b border-border-gray-alt">
            <Link href="/register" onClick={onClose} className="block py-4 text-dark-gray-alt hover:text-primary-green transition-colors">
              Register
            </Link>
          </li>
          <li className="border-b border-border-gray-alt">
            <Link href="/login" onClick={onClose} className="block py-4 text-dark-gray-alt hover:text-primary-green transition-colors flex items-center gap-2">
              <User className="h-5 w-5" />
              Log in
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </>
);

const HeaderMobile = () => {
  const [isNavOpen, setNavOpen] = useState(false);
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
      return selectedAddress.pincode;
    }
    return "Pincode";
  };

  return (
    <>
      <header className="sticky top-[36px] left-0 right-0 z-30 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.1)] lg:hidden">
        <div className="relative flex items-center justify-between h-[72px] px-4">
          
          <div className="flex items-center gap-2">
            <button onClick={() => setNavOpen(true)} className="flex items-center justify-center w-11 h-11 -ml-2 cursor-pointer" aria-label="Open menu">
              <Menu size={28} className="text-dark-gray" />
            </button>
            <AddressDropdown onAddressChange={setSelectedAddress}>
              <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/svgs/Location_4-1.svg" alt="Location Icon" width={18} height={21} />
                <div>
                  <span className="block text-caption text-medium-gray leading-none">Deliver to</span>
                  <div className="flex items-center text-sm font-semibold text-dark-gray-alt pt-1">
                    <span>{getAddressDisplay()}</span>
                    <ChevronDown size={16} className="ml-0.5" />
                  </div>
                </div>
              </div>
            </AddressDropdown>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/images/OM_Logo_2-1.png"
                alt="EverSol"
                width={100}
                height={36}
                priority
              />
            </Link>
          </div>

          <div className="flex items-center">
            <Link href="/wishlist" className="relative flex items-center justify-center w-11 h-11" aria-label="Wishlist">
              <Heart size={25} className="text-dark-gray"/>
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary-green text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center min-w-[16px]">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative flex items-center justify-center w-11 h-11 -mr-2" aria-label="Cart">
              <ShoppingCart size={25} className="text-dark-gray"/>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-primary-green text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center min-w-[16px]">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
      
      <NavPanel isOpen={isNavOpen} onClose={() => setNavOpen(false)} />
    </>
  );
};

export default HeaderMobile;