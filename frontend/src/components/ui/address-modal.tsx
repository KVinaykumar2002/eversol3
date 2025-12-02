"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveAddress, type Address } from "@/lib/address-functionality";

interface AddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address?: Address | null;
  onSave?: () => void;
}

export default function AddressModal({
  open,
  onOpenChange,
  address,
  onSave,
}: AddressModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    type: "home" as "home" | "work" | "other",
    isDefault: false,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      if (address) {
        setFormData({
          name: address.name || "",
          phone: address.phone || "",
          addressLine1: address.addressLine1 || "",
          addressLine2: address.addressLine2 || "",
          city: address.city || "",
          state: address.state || "",
          pincode: address.pincode || "",
          type: address.type || "home",
          isDefault: address.isDefault || false,
        });
      } else {
        setFormData({
          name: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          pincode: "",
          type: "home",
          isDefault: false,
        });
      }
      setError(null);
    }
  }, [open, address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError(null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError("Please enter a valid phone number");
      return false;
    }
    if (!formData.addressLine1.trim()) {
      setError("Please enter address line 1");
      return false;
    }
    if (!formData.city.trim()) {
      setError("Please enter city");
      return false;
    }
    if (!formData.state.trim()) {
      setError("Please enter state");
      return false;
    }
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const addressToSave = address
        ? { ...address, ...formData }
        : formData;

      const result = saveAddress(addressToSave);

      if (result.success) {
        onSave?.();
        onOpenChange(false);
      } else {
        setError(result.message || "Failed to save address");
      }
    } catch (err) {
      setError("An error occurred while saving the address");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-[600px] p-0 overflow-hidden shadow-lg rounded-xl w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
        <div className="sm:p-8 p-6">
          <DialogHeader className="p-0 text-left mb-6">
            <DialogTitle className="text-2xl font-semibold text-dark-gray-alt">
              {address ? "Edit Address" : "Add New Address"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-dark-gray mb-2 block">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-dark-gray mb-2 block">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full h-11"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="addressLine1" className="text-sm font-medium text-dark-gray mb-2 block">
                Address Line 1 *
              </Label>
              <Input
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="House/Flat No., Building Name"
                className="w-full h-11"
                required
              />
            </div>

            <div>
              <Label htmlFor="addressLine2" className="text-sm font-medium text-dark-gray mb-2 block">
                Address Line 2 (Optional)
              </Label>
              <Input
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Street, Area, Landmark"
                className="w-full h-11"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="text-sm font-medium text-dark-gray mb-2 block">
                  City *
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="state" className="text-sm font-medium text-dark-gray mb-2 block">
                  State *
                </Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="w-full h-11"
                  required
                />
              </div>

              <div>
                <Label htmlFor="pincode" className="text-sm font-medium text-dark-gray mb-2 block">
                  Pincode *
                </Label>
                <Input
                  id="pincode"
                  name="pincode"
                  type="tel"
                  value={formData.pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    if (value.length <= 6) {
                      handleChange({
                        ...e,
                        target: { ...e.target, value },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }
                  }}
                  placeholder="6-digit pincode"
                  className="w-full h-11"
                  maxLength={6}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="type" className="text-sm font-medium text-dark-gray mb-2 block">
                Address Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger className="w-full h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="w-4 h-4 text-primary-green border-border-gray-alt rounded focus:ring-primary-green"
              />
              <Label htmlFor="isDefault" className="text-sm text-dark-gray cursor-pointer">
                Set as default address
              </Label>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : address ? "Update Address" : "Save Address"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

