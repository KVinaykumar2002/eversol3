"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Grid,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

// Categories in exact order as specified
const categories = [
  "Dals & Pulses",
  "Dry Fruits",
  "Spices & Masalas",
  "Home Essential",
  "Millets",
  "Oils",
  "Sweeteners",
  "Sweets",
  "Bakery",
  "Ready To Cook",
];

// Category hrefs mapping
const categoryHrefs: Record<string, string> = {
  "Dals & Pulses": "/collections/dals-pulses",
  "Dry Fruits": "/collections/dry-fruits",
  "Spices & Masalas": "/collections/spices-masalas",
  "Home Essential": "/collections/home-essential",
  "Millets": "/collections/millets",
  "Oils": "/collections/edible-oils",
  "Sweeteners": "/collections/sweeteners",
  "Sweets": "/collections/sweets",
  "Bakery": "/collections/bakery",
  "Ready To Cook": "/collections/ready-to-cook",
};

export default function CategoryDropdown() {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);


  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  // Close on ESC key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="default"
        onClick={() => setOpen(!open)}
        className="bg-primary-green hover:bg-primary-green/90 text-white font-semibold text-sm rounded-md h-11 px-5 flex items-center gap-2"
      >
        <Grid size={17} />
        <span>Browse All Categories</span>
        {open ? (
          <ChevronUp size={16} className="transition-transform duration-200" />
        ) : (
          <ChevronDown size={16} className="transition-transform duration-200" />
        )}
      </Button>

      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2.5 w-[calc(100vw-40px)] md:w-[500px] max-w-[500px] bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-[#E6E6E6] p-4 z-50"
            style={{ willChange: "transform, opacity" }}
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-sm opacity-70 hover:opacity-100 hover:bg-gray-100 transition-all duration-200"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-dark-gray-alt" />
            </button>

            {/* Categories Grid - 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                >
                  <Link href={categoryHrefs[category] || "#"} onClick={() => setOpen(false)}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left px-3 py-2 bg-white border border-[#E6E6E6] rounded-md text-sm font-medium text-[#244424] hover:border-[#1d4d2e] hover:shadow-md transition-all duration-200 touch-manipulation"
                    >
                      {category}
                    </motion.button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
