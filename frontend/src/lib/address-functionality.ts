/**
 * Address Management Functionality
 * Handles saving, retrieving, and managing delivery addresses
 */

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type?: 'home' | 'work' | 'other';
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'eversol_addresses';
const SELECTED_ADDRESS_KEY = 'eversol_selected_address';

// Event names for address updates
export const getAddressUpdateEventName = () => 'address-updated';

/**
 * Get all saved addresses from localStorage
 */
export const getSavedAddresses = (): Address[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const addresses: Address[] = JSON.parse(stored);
    // Sort: default first, then by updatedAt
    return addresses.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return b.updatedAt - a.updatedAt;
    });
  } catch (error) {
    console.error('Error loading addresses:', error);
    return [];
  }
};

/**
 * Get the currently selected/default address
 */
export const getSelectedAddress = (): Address | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const selectedId = localStorage.getItem(SELECTED_ADDRESS_KEY);
    if (selectedId) {
      const addresses = getSavedAddresses();
      const found = addresses.find(a => a.id === selectedId);
      if (found) return found;
    }
    
    // If no selected address, return the default one
    const addresses = getSavedAddresses();
    const defaultAddress = addresses.find(a => a.isDefault);
    return defaultAddress || addresses[0] || null;
  } catch (error) {
    console.error('Error loading selected address:', error);
    return null;
  }
};

/**
 * Save a new address or update an existing one
 */
export const saveAddress = (address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'> | Address): { success: boolean; address?: Address; message?: string } => {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Not available on server' };
  }

  try {
    const addresses = getSavedAddresses();
    let updatedAddresses: Address[];
    let newAddress: Address;

    // Check if this is an update or new address
    const existingIndex = 'id' in address ? addresses.findIndex(a => a.id === address.id) : -1;
    
    const now = Date.now();

    if (existingIndex >= 0) {
      // Update existing address
      const existing = addresses[existingIndex];
      newAddress = {
        ...existing,
        ...address,
        updatedAt: now,
      };
      
      // If setting as default, remove default from others
      if (address.isDefault) {
        addresses.forEach(a => {
          if (a.id !== newAddress.id) a.isDefault = false;
        });
      }
      
      updatedAddresses = [...addresses];
      updatedAddresses[existingIndex] = newAddress;
    } else {
      // Add new address
      newAddress = {
        ...address,
        id: `addr_${now}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
      };
      
      // If this is the first address or marked as default, set as default
      if (addresses.length === 0 || address.isDefault) {
        newAddress.isDefault = true;
        addresses.forEach(a => a.isDefault = false);
      }
      
      updatedAddresses = [...addresses, newAddress];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAddresses));
    
    // If this is the default or first address, set as selected
    if (newAddress.isDefault || addresses.length === 0) {
      localStorage.setItem(SELECTED_ADDRESS_KEY, newAddress.id);
    }

    // Dispatch update event
    window.dispatchEvent(new CustomEvent(getAddressUpdateEventName()));

    return { success: true, address: newAddress };
  } catch (error) {
    console.error('Error saving address:', error);
    return { success: false, message: 'Failed to save address' };
  }
};

/**
 * Delete an address
 */
export const deleteAddress = (addressId: string): { success: boolean; message?: string } => {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Not available on server' };
  }

  try {
    const addresses = getSavedAddresses();
    const filtered = addresses.filter(a => a.id !== addressId);
    
    if (filtered.length === addresses.length) {
      return { success: false, message: 'Address not found' };
    }

    // If deleted address was selected, select default or first
    const selectedId = localStorage.getItem(SELECTED_ADDRESS_KEY);
    if (selectedId === addressId) {
      const newDefault = filtered.find(a => a.isDefault) || filtered[0];
      if (newDefault) {
        localStorage.setItem(SELECTED_ADDRESS_KEY, newDefault.id);
      } else {
        localStorage.removeItem(SELECTED_ADDRESS_KEY);
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    // Dispatch update event
    window.dispatchEvent(new CustomEvent(getAddressUpdateEventName()));

    return { success: true };
  } catch (error) {
    console.error('Error deleting address:', error);
    return { success: false, message: 'Failed to delete address' };
  }
};

/**
 * Set an address as the selected/default address
 */
export const setSelectedAddress = (addressId: string): { success: boolean; message?: string } => {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Not available on server' };
  }

  try {
    const addresses = getSavedAddresses();
    const address = addresses.find(a => a.id === addressId);
    
    if (!address) {
      return { success: false, message: 'Address not found' };
    }

    // Update all addresses to set this as default
    const updatedAddresses = addresses.map(a => ({
      ...a,
      isDefault: a.id === addressId,
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAddresses));
    localStorage.setItem(SELECTED_ADDRESS_KEY, addressId);
    
    // Dispatch update event
    window.dispatchEvent(new CustomEvent(getAddressUpdateEventName()));

    return { success: true };
  } catch (error) {
    console.error('Error setting selected address:', error);
    return { success: false, message: 'Failed to set selected address' };
  }
};

/**
 * Get address count
 */
export const getAddressCount = (): number => {
  return getSavedAddresses().length;
};

