`use client`;

const WISHLIST_STORAGE_KEY = 'eversol-wishlist';
const WISHLIST_UPDATED_EVENT = 'wishlist-updated';

export interface WishlistItem {
  id: string; // Unique wishlist entry ID (defaults to productId)
  productId: string;
  title: string;
  imageUrl: string;
  variantId?: string;
  variantName?: string;
  price?: number;
  coopPrice?: number;
}

type StoredWishlist = WishlistItem[] | string[];

/**
 * Converts any legacy wishlist data (string[]) into the new WishlistItem[] shape.
 */
const normalizeWishlistData = (data: StoredWishlist): WishlistItem[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  if (data.length === 0 || typeof data[0] === 'object') {
    return data as WishlistItem[];
  }

  // Legacy format (string[])
  return (data as string[]).map((productId) => ({
    id: productId,
    productId,
    title: 'Wishlist Item',
    imageUrl: '',
  }));
};

/**
 * Helper function to safely get the wishlist from localStorage.
 * Returns an empty array if localStorage is not available (e.g., on the server) or if an error occurs.
 * @returns {WishlistItem[]} An array of wishlist items.
 */
const getWishlistFromStorage = (): WishlistItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const wishlistJson = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    const parsed = wishlistJson ? (JSON.parse(wishlistJson) as StoredWishlist) : [];
    return normalizeWishlistData(parsed);
  } catch (error) {
    console.error('Error reading wishlist from localStorage:', error);
    // In case of parsing error, clear the corrupted data.
    window.localStorage.removeItem(WISHLIST_STORAGE_KEY);
    return [];
  }
};

/**
 * Helper function to safely save the wishlist to localStorage.
 * Dispatches a 'wishlist-updated' event on success.
 * @param wishlist - The array of product IDs to save.
 */
const saveWishlistToStorage = (wishlist: WishlistItem[]): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const wishlistJson = JSON.stringify(wishlist);
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, wishlistJson);
    // Dispatch a custom event to notify other parts of the app about the change.
    // UI components (e.g., header wishlist icon) can listen to this to update their state.
    window.dispatchEvent(new CustomEvent(WISHLIST_UPDATED_EVENT));
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
};

/**
 * Adds a product to the wishlist if it's not already present.
 * Triggers a toast notification on success.
 * @param productId - The ID of the product to add.
 */
export const addToWishlist = (item: WishlistItem): void => {
  if (!item?.productId) return;
  const currentWishlist = getWishlistFromStorage();
  if (!currentWishlist.some((wishlistItem) => wishlistItem.productId === item.productId)) {
    const wishlistItem: WishlistItem = {
      id: item.id || item.productId,
      title: item.title || 'Wishlist Item',
      imageUrl: item.imageUrl || '',
      ...item,
    };
    const updatedWishlist = [...currentWishlist, wishlistItem];
    saveWishlistToStorage(updatedWishlist);
    // Dispatch an event for toast notifications. A central toast manager can listen for this.
    window.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: { message: 'Item(s) successfully added to the wishlist', type: 'success' },
      }),
    );
  }
};

/**
 * Removes a product from the wishlist if it exists.
 * Triggers a toast notification on success.
 * @param productId - The ID of the product to remove.
 */
export const removeFromWishlist = (productId: string): void => {
  if (!productId) return;
  const currentWishlist = getWishlistFromStorage();
  const updatedWishlist = currentWishlist.filter((item) => item.productId !== productId);
  if (updatedWishlist.length < currentWishlist.length) {
    saveWishlistToStorage(updatedWishlist);
    window.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: { message: 'Product removed from wishlist.', type: 'info' },
      }),
    );
  }
};

/**
 * Toggles a product's presence in the wishlist.
 * Adds it if it's not there, removes it if it is.
 * This is useful for "heart" or "favorite" buttons.
 * @param productId - The ID of the product to toggle.
 */
export const toggleWishlist = (item: WishlistItem): void => {
  if (!item?.productId) return;
  if (isInWishlist(item.productId)) {
    removeFromWishlist(item.productId);
  } else {
    addToWishlist(item);
  }
};

/**
 * Checks if a product is in the wishlist. Safe to call on the server (always returns false).
 * @param productId - The ID of the product to check.
 * @returns {boolean} - True if the product is in the wishlist, false otherwise.
 */
export const isInWishlist = (productId: string): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  return getWishlistFromStorage().some((item) => item.productId === productId);
};

/**
 * Retrieves all product IDs from the wishlist.
 * @returns {string[]} - An array of product IDs.
 */
export const getWishlistItems = (): WishlistItem[] => {
  return getWishlistFromStorage();
};

/**
 * Gets the total number of items in the wishlist.
 * @returns {number} The count of items in the wishlist.
 */
export const getWishlistCount = (): number => {
  return getWishlistFromStorage().length;
};

/**
 * Returns the custom event name dispatched whenever the wishlist updates.
 */
export const getWishlistUpdateEventName = (): string => {
  return WISHLIST_UPDATED_EVENT;
};

/**
 * Clears the entire wishlist from localStorage.
 */
export const clearWishlist = (): void => {
  saveWishlistToStorage([]);
  window.dispatchEvent(
    new CustomEvent('show-toast', {
      detail: { message: 'Wishlist cleared.', type: 'info' },
    }),
  );
};

/**
 * Moves an item from the wishlist to the cart.
 * Requires a callback function to handle adding the item to the cart.
 * @param productId - The ID of the product to move.
 * @param addToCartFn - A function that takes a product ID and quantity to add to the cart.
 */
export const moveWishlistItemToCart = (
  productId: string,
  addToCartFn: (id: string, quantity: number) => void | Promise<void>,
): void => {
  if (isInWishlist(productId)) {
    try {
      Promise.resolve(addToCartFn(productId, 1)).then(() => {
        removeFromWishlist(productId);
        window.dispatchEvent(
          new CustomEvent('show-toast', {
            detail: { message: 'Product moved to cart.', type: 'success' },
          }),
        );
      });
    } catch (error) {
      console.error('Failed to move item to cart:', error);
      window.dispatchEvent(
        new CustomEvent('show-toast', {
          detail: { message: 'Could not move item to cart.', type: 'error' },
        }),
      );
    }
  }
};

/**
 * Creates a shareable link for the current wishlist.
 * Encodes wishlist product IDs into a URL query parameter.
 * A dedicated page (e.g., /wishlist) would need to be able to parse this.
 * @returns {string} A URL for sharing the wishlist.
 */
export const getShareableWishlistLink = (): string => {
  if (typeof window === 'undefined') {
    return '';
  }
  const wishlistItems = getWishlistItems();
  if (wishlistItems.length === 0) {
    // Return base URL or wishlist page URL if empty
    return `${window.location.origin}/wishlist`;
  }
  const params = new URLSearchParams();
  params.append('shared_wishlist', wishlistItems.join(','));
  return `${window.location.origin}/wishlist?${params.toString()}`;
};

// --- Placeholder for backend synchronization for logged-in users ---

/**
 * Syncs the local wishlist with a server backend.
 * This is a placeholder for a real implementation.
 * It would merge local (anonymous) and server (user) wishlists.
 * @param userId - The unique identifier for the logged-in user.
 * @param api - An API client instance for making requests.
 */
export const syncWishlistWithServer = async (
  userId: string,
  // Example of passing an API client
  // api: { get: (url: string) => Promise<any>; post: (url: string, data: any) => Promise<any> },
): Promise<void> => {
  console.log(`(Placeholder) Syncing wishlist for user ${userId}...`);
  try {
    // 1. Fetch server wishlist
    // const { data: serverWishlist } = await api.get(`/wishlists/${userId}`);
    const serverWishlist: string[] = []; // Mock response

    // 2. Get local wishlist
    const localWishlist = getWishlistFromStorage();

    // 3. Merge lists (using a Set to handle duplicates)
    const mergedWishlist = [...new Set([...serverWishlist, ...localWishlist])];

    // 4. Update server with the merged list
    // await api.post(`/wishlists/${userId}`, { items: mergedWishlist });

    // 5. Update local storage with the final, synced list
    saveWishlistToStorage(mergedWishlist);

    console.log('(Placeholder) Wishlist synced successfully.');
  } catch (error) {
    console.error('Failed to sync wishlist with server:', error);
    window.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: { message: 'Failed to sync your wishlist.', type: 'error' },
      }),
    );
  }
};