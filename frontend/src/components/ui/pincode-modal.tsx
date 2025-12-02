"use client";

import * as React from "react";
import Image from "next/image";
import { X, Loader2, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface PincodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPincodeSubmit: (pincode: string) => void;
  recentPincodes?: string[];
}

export default function PincodeModal({
  open,
  onOpenChange,
  onPincodeSubmit,
  recentPincodes = ["560038", "560001"],
}: PincodeModalProps) {
  const [pincode, setPincode] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGeolocating, setIsGeolocating] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setPincode("");
        setError(null);
        setIsLoading(false);
        setIsGeolocating(false);
      }, 300);
    }
  }, [open]);

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 6) {
      setPincode(value);
      if (error) setError(null);
    }
  };

  const checkPincode = async (pincodeToCheck: string) => {
    if (pincodeToCheck.length !== 6) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const serviceablePincodes = ["560038", "560001", "560078"];
    if (serviceablePincodes.includes(pincodeToCheck)) {
      onPincodeSubmit(pincodeToCheck);
      onOpenChange(false);
    } else {
      setError("Sorry, delivery is not available in this area.");
    }
    setIsLoading(false);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await checkPincode(pincode);
  };

  const handleRecentPincodeClick = async (recentPincode: string) => {
    if(isLoading || isGeolocating) return;
    setPincode(recentPincode);
    await checkPincode(recentPincode);
  }

  const handleUseCurrentLocation = () => {
    if (isLoading || isGeolocating) return;
    setIsGeolocating(true);
    setError(null);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await new Promise(resolve => setTimeout(resolve, 1500));
          const simulatedPincode = "560078";
          setPincode(simulatedPincode);
          setIsGeolocating(false);
          await checkPincode(simulatedPincode);
        },
        () => {
          setError("Could not get your location. Please enter it manually.");
          setIsGeolocating(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setIsGeolocating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="bg-white max-w-[480px] p-0 overflow-hidden shadow-lg rounded-xl w-[calc(100%-2rem)]"
      >
        <div className="sm:p-8 p-6">
          <DialogHeader className="p-0 text-left mb-6">
            <DialogTitle className="text-2xl font-semibold text-dark-gray-alt leading-tight">
              Select a location for delivery
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/svgs/Location_4-1.svg"
                  alt="Location Pin"
                  width={20}
                  height={20}
                />
              </div>
              <Input
                type="tel"
                placeholder="Enter your Pincode"
                value={pincode}
                onChange={handlePincodeChange}
                maxLength={6}
                className="w-full h-[52px] pl-12 pr-4 text-base border-border-gray-alt rounded focus:ring-primary focus:border-primary text-dark-gray bg-white"
                aria-label="Pincode"
                disabled={isLoading || isGeolocating}
              />
            </div>
            
            {error && <p className="text-destructive text-sm -mt-2">{error}</p>}
            
            <Button
              type="submit"
              className="w-full h-12 bg-primary text-primary-foreground text-sm font-semibold uppercase rounded hover:bg-[#0A3D31] transition-colors disabled:bg-medium-gray-alt disabled:cursor-not-allowed"
              disabled={isLoading || isGeolocating || pincode.length !== 6}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={handleUseCurrentLocation}
              className="text-sm font-semibold text-primary disabled:cursor-wait disabled:text-medium-gray"
              disabled={isLoading || isGeolocating}
            >
              <div className="flex items-center justify-center gap-2">
                {isGeolocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4"/> }
                <span>Use current location</span>
              </div>
            </button>
          </div>
          
          {recentPincodes.length > 0 && 
            <div className="mt-8">
              <h4 className="text-xs font-semibold text-medium-gray uppercase tracking-wider mb-3">
                Recently Used Pincodes
              </h4>
              <div className="flex flex-wrap gap-2">
                {recentPincodes.map((p) => (
                  <button 
                    key={p} 
                    onClick={() => handleRecentPincodeClick(p)}
                    className="px-4 py-2 bg-light-gray text-dark-gray-alt text-sm rounded-full leading-none hover:bg-border-gray transition-colors disabled:cursor-wait"
                    disabled={isLoading || isGeolocating}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          }
        </div>
        <DialogClose asChild>
          <button
            className="absolute top-3 right-3 p-1 rounded-full text-medium-gray-alt transition-colors hover:bg-light-gray hover:text-dark-gray"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}