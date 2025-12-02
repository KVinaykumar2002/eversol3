"use client";

import * as React from "react";
import Image from "next/image";
import { MapPin, Plus, Edit2, Trash2, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import AddressModal from "./address-modal";
import {
  getSavedAddresses,
  getSelectedAddress,
  setSelectedAddress,
  deleteAddress,
  getAddressUpdateEventName,
  type Address,
} from "@/lib/address-functionality";

interface AddressDropdownProps {
  children: React.ReactNode;
  onAddressChange?: (address: Address | null) => void;
}

export default function AddressDropdown({
  children,
  onAddressChange,
}: AddressDropdownProps) {
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [selectedAddress, setSelectedAddressState] = React.useState<Address | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<Address | null>(null);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const loadAddresses = React.useCallback(() => {
    const savedAddresses = getSavedAddresses();
    const currentSelected = getSelectedAddress();
    setAddresses(savedAddresses);
    setSelectedAddressState(currentSelected);
    onAddressChange?.(currentSelected);
  }, [onAddressChange]);

  React.useEffect(() => {
    loadAddresses();

    const handleUpdate = () => {
      loadAddresses();
    };

    window.addEventListener(getAddressUpdateEventName(), handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(getAddressUpdateEventName(), handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [loadAddresses]);

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address.id);
    loadAddresses();
    setIsDropdownOpen(false);
  };

  const handleEditAddress = (address: Address, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddress(address);
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleDeleteAddress = async (addressId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }
    
    setIsDeleting(addressId);
    const result = deleteAddress(addressId);
    setIsDeleting(null);
    
    if (result.success) {
      loadAddresses();
    } else {
      alert(result.message || "Failed to delete address");
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleModalSave = () => {
    loadAddresses();
  };

  const formatAddressDisplay = (address: Address): string => {
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.pincode,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const getAddressTypeIcon = (type?: string) => {
    switch (type) {
      case "home":
        return "🏠";
      case "work":
        return "🏢";
      default:
        return "📍";
    }
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[400px] max-h-[500px] overflow-y-auto">
          <DropdownMenuLabel className="flex items-center gap-2 text-base font-semibold">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/56749ad2-75ec-41c1-917d-cfc50301e8cc-organicmandya-com/assets/svgs/Location_4-1.svg"
              alt="Location Icon"
              width={16}
              height={20}
            />
            Delivery Address
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {addresses.length === 0 ? (
            <div className="p-4 text-center">
              <MapPin className="w-12 h-12 text-medium-gray mx-auto mb-3" />
              <p className="text-sm text-medium-gray mb-4">
                No saved addresses found
              </p>
              <Button
                onClick={handleAddNew}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </div>
          ) : (
            <>
              <div className="max-h-[300px] overflow-y-auto">
                {addresses.map((address) => {
                  const isSelected = selectedAddress?.id === address.id;
                  const isDeletingThis = isDeleting === address.id;

                  return (
                    <div
                      key={address.id}
                      className={`p-3 border-b border-border-gray-alt last:border-b-0 cursor-pointer hover:bg-light-gray transition-colors ${
                        isSelected ? "bg-light-green/30" : ""
                      }`}
                      onClick={() => handleSelectAddress(address)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-base">
                              {getAddressTypeIcon(address.type)}
                            </span>
                            <span className="font-semibold text-dark-gray text-sm">
                              {address.name}
                            </span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-primary-green flex-shrink-0" />
                            )}
                            {address.isDefault && (
                              <span className="text-xs bg-primary-green text-white px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-medium-gray mb-1">
                            {formatAddressDisplay(address)}
                          </p>
                          <p className="text-xs text-medium-gray">
                            {address.phone}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={(e) => handleEditAddress(address, e)}
                            className="p-1.5 hover:bg-white rounded transition-colors"
                            title="Edit address"
                          >
                            <Edit2 className="w-4 h-4 text-dark-gray-alt" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteAddress(address.id, e)}
                            disabled={isDeletingThis}
                            className="p-1.5 hover:bg-white rounded transition-colors disabled:opacity-50"
                            title="Delete address"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleAddNew}
                className="cursor-pointer focus:bg-light-green"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Address
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AddressModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        address={editingAddress}
        onSave={handleModalSave}
      />
    </>
  );
}

