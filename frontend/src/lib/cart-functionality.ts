/**
 * @file cart-functionality.ts
 * This file implements the complete shopping cart logic for the EverSol storefront.
 * It handles adding, removing, updating, and clearing cart items, calculates totals
 * including Co-Op member discounts and taxes, and persists the cart state to localStorage.
 * It is designed to be used in a browser environment and supports synchronization across tabs.
 *
 * It is built to be framework-agnostic but designed with a modern frontend framework (like React/Next.js)
 * in mind, where UI components can react to cart updates.
 */

// =================================================================================
// TYPE DEFINITIONS
// =================================================================================

/**
 * Represents a specific variant of a product, e.g., "500g" or "1L".
 */
export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  coopPrice: number;
  stock: number;
}

/**
 * Represents a product available for sale.
 * In a real application, this data would be fetched from a backend API.
 */
export interface Product {
  id:string;
  name: string;
  imageUrl: string;
  variants: ProductVariant[];
}

/**
 * Represents a single line item in the shopping cart.
 */
export interface CartItem {
  id: string; // Composite key: `${productId}-${variantId}`
  productId: string;
  productName: string;
  productImage: string;
  variantId: string;
  variantName: string;
  quantity: number;
  price: number; // Regular price per unit
  coopPrice: number; // Co-Op member price per unit
  linePrice: number; // Total for this line: quantity * effective price
}

/**
 * Represents the entire state of the shopping cart.
 */
export interface Cart {
  items: CartItem[];
  itemCount: number; // Total quantity of all items
  subtotal: number; // Sum of all line prices
  tax: number;
  total: number; // Final amount: subtotal - discount + tax
  discount: {
    code: string | null;
    amount: number;
  };
  isCoOpMember: boolean;
}

// =================================================================================
// CONSTANTS & MOCK DATA
// =================================================================================

const CART_STORAGE_KEY = 'eversol-cart';
const CART_UPDATED_EVENT = 'cartUpdated';
const TAX_RATE = 0.05; // 5% tax rate, for example
const MINIMUM_ORDER_VALUE = 100; // Example minimum order value

/**
 * MOCK PRODUCT DATABASE
 * In a real application, this data would come from a backend API.
 * The `getProductById` function simulates fetching this data.
 */
const mockProducts: Product[] = [
    { id: 'prod-1', name: 'Organic Rajmudi Rice', imageUrl: '/products/rajmudi-rice.jpg', variants: [
        { id: 'var-1-1', name: '1kg', price: 152.00, coopPrice: 129.20, stock: 10 },
        { id: 'var-1-2', name: '5kg', price: 750.00, coopPrice: 637.50, stock: 5 },
    ]},
    { id: 'prod-3', name: 'Organic Tur/Toor Dal', imageUrl: '/products/toor-dal.jpg', variants: [
        { id: 'var-3-1', name: '500g', price: 182.00, coopPrice: 154.70, stock: 0 }, // Out of stock
        { id: 'var-3-2', name: '1kg', price: 350.00, coopPrice: 297.50, stock: 15 },
    ]},
    { id: 'prod-4', name: 'Cold Pressed - Groundnut Oil', imageUrl: '/products/groundnut-oil.jpg', variants: [
        { id: 'var-4-1', name: '1L', price: 494.00, coopPrice: 419.90, stock: 8 },
    ]},
];

/**
 * MOCK DISCOUNT CODES
 * In a real application, these would be validated against a backend service.
 */
const validDiscountCodes: Record<string, { type: 'percentage' | 'fixed'; value: number }> = {
    'EXTRA10': { type: 'percentage', value: 10 },
    'FLAT50': { type: 'fixed', value: 50 },
};

// =================================================================================
// INTERNAL HELPER FUNCTIONS
// =================================================================================

/**
 * Retrieves product data by its ID.
 * NOTE: This is a mock API call. Replace with actual fetch logic.
 * @param productId The ID of the product to fetch.
 * @returns A promise that resolves to the Product object or undefined if not found.
 */
const getProductById = async (productId: string): Promise<Product | undefined> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    const found = mockProducts.find(p => p.id === productId);
    
    // If not found in mock data, try to create a basic product structure
    // This allows products from other sources to be added to cart
    if (!found) {
        // Try to extract product info from localStorage or return a basic structure
        // For now, return undefined - the calling code should handle this
        return undefined;
    }
    
    return found;
};


/**
 * Recalculates all derived values in the cart (totals, counts, etc.).
 * @param cart The cart object to recalculate.
 * @returns The recalculated cart object.
 */
const recalculateCart = (cart: Cart): Cart => {
    let subtotal = 0;
    let itemCount = 0;

    for (const item of cart.items) {
        const priceToUse = cart.isCoOpMember ? item.coopPrice : item.price;
        item.linePrice = item.quantity * priceToUse;
        subtotal += item.linePrice;
        itemCount += item.quantity;
    }

    cart.itemCount = itemCount;
    cart.subtotal = subtotal;

    // Recalculate discount in case subtotal changed
    if (cart.discount.code) {
        const discountInfo = validDiscountCodes[cart.discount.code.toUpperCase()];
        if (discountInfo) {
            if (discountInfo.type === 'fixed') {
                cart.discount.amount = discountInfo.value;
            } else {
                cart.discount.amount = subtotal * (discountInfo.value / 100);
            }
        }
    }


    const subtotalAfterDiscount = Math.max(0, subtotal - cart.discount.amount);
    cart.tax = subtotalAfterDiscount * TAX_RATE;
    cart.total = subtotalAfterDiscount + cart.tax;

    return cart;
};


/**
 * Retrieves the cart from localStorage. Handles SSR and parsing errors.
 * @returns The current cart state.
 */
const getCart = (): Cart => {
  const defaultCart: Cart = {
    items: [],
    itemCount: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    discount: { code: null, amount: 0 },
    isCoOpMember: false,
  };

  if (typeof window === 'undefined') {
    return defaultCart;
  }

  try {
    const cartJson = localStorage.getItem(CART_STORAGE_KEY);
    if (cartJson) {
      // Potentially merge with default cart to handle schema changes
      const parsedCart = JSON.parse(cartJson);
      return { ...defaultCart, ...parsedCart };
    }
  } catch (error) {
    console.error("Failed to parse cart from localStorage:", error);
  }

  return defaultCart;
};

/**
 * Saves the cart to localStorage and notifies the application of the update.
 * @param cart The cart state to save.
 */
const saveCartAndNotify = (cart: Cart): void => {
  if (typeof window === 'undefined') return;
  try {
    const cartJson = JSON.stringify(cart);
    localStorage.setItem(CART_STORAGE_KEY, cartJson);
    // Dispatch a custom event to notify listeners on the current page (e.g., React hooks).
    // The 'storage' event will notify other tabs.
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: { ...cart } }));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};


// =================================================================================
// EXPORTED CART API
// =================================================================================

/**
 * Adds an item to the cart or updates its quantity if it already exists.
 * @param productId The ID of the product to add.
 * @param variantId The ID of the product variant.
 * @param quantity The number of units to add.
 * @returns A promise that resolves to an object indicating success and a message.
 */
export const addToCart = async (
  productId: string,
  variantId: string,
  quantity: number
): Promise<{ success: boolean; message: string; requiresAuth?: boolean }> => {
  // Check authentication
  if (typeof window !== 'undefined') {
    const { checkAuth } = await import('./auth-utils');
    const user = await checkAuth();
    if (!user || user.role !== 'user') {
      return { 
        success: false, 
        message: 'Please login to add items to cart.', 
        requiresAuth: true 
      };
    }
  }

  if (quantity <= 0) {
    return { success: false, message: 'Quantity must be positive.' };
  }

  const productData = await getProductById(productId);
  if (!productData) {
    return { success: false, message: 'Product not found.' };
  }

  const variant = productData.variants.find(v => v.id === variantId);
  if (!variant) {
    return { success: false, message: 'Product variant not found.' };
  }

  const cart = getCart();
  const cartItemId = `${productId}-${variantId}`;
  const existingItem = cart.items.find(item => item.id === cartItemId);
  const newQuantity = (existingItem?.quantity || 0) + quantity;

  if (newQuantity > variant.stock) {
    return { success: false, message: `Not enough stock. Only ${variant.stock} available.` };
  }

  if (existingItem) {
    existingItem.quantity = newQuantity;
  } else {
    const newItem: CartItem = {
      id: cartItemId,
      productId: productData.id,
      productName: productData.name,
      productImage: productData.imageUrl,
      variantId: variant.id,
      variantName: variant.name,
      quantity: newQuantity,
      price: variant.price,
      coopPrice: variant.coopPrice,
      linePrice: 0, // Recalculated below
    };
    cart.items.push(newItem);
  }

  const updatedCart = recalculateCart(cart);
  saveCartAndNotify(updatedCart);

  return { success: true, message: `${productData.name} (${variant.name}) added to cart.` };
};

/**
 * Adds an item directly to the cart with product data (bypasses product lookup).
 * Useful for products that aren't in the mock database.
 * @param productData The product data object.
 * @param variantId The ID of the product variant.
 * @param quantity The number of units to add.
 * @returns An object indicating success and a message.
 */
export const addToCartDirect = async (
  productData: Product,
  variantId: string,
  quantity: number
): Promise<{ success: boolean; message: string; requiresAuth?: boolean }> => {
  // Check authentication
  if (typeof window !== 'undefined') {
    const { checkAuth } = await import('./auth-utils');
    const user = await checkAuth();
    if (!user || user.role !== 'user') {
      return { 
        success: false, 
        message: 'Please login to add items to cart.', 
        requiresAuth: true 
      };
    }
  }

  if (quantity <= 0) {
    return { success: false, message: 'Quantity must be positive.' };
  }

  const variant = productData.variants.find(v => v.id === variantId);
  if (!variant) {
    return { success: false, message: 'Product variant not found.' };
  }

  const cart = getCart();
  const cartItemId = `${productData.id}-${variantId}`;
  const existingItem = cart.items.find(item => item.id === cartItemId);
  const newQuantity = (existingItem?.quantity || 0) + quantity;

  if (newQuantity > variant.stock) {
    return { success: false, message: `Not enough stock. Only ${variant.stock} available.` };
  }

  if (existingItem) {
    existingItem.quantity = newQuantity;
  } else {
    const newItem: CartItem = {
      id: cartItemId,
      productId: productData.id,
      productName: productData.name,
      productImage: productData.imageUrl,
      variantId: variant.id,
      variantName: variant.name,
      quantity: newQuantity,
      price: variant.price,
      coopPrice: variant.coopPrice,
      linePrice: 0, // Recalculated below
    };
    cart.items.push(newItem);
  }

  const updatedCart = recalculateCart(cart);
  saveCartAndNotify(updatedCart);

  return { success: true, message: `${productData.name} (${variant.name}) added to cart.` };
};

/**
 * Removes an item completely from the cart.
 * @param itemId The unique ID of the cart item to remove.
 */
export const removeFromCart = (itemId: string): void => {
  let cart = getCart();
  cart.items = cart.items.filter(item => item.id !== itemId);
  cart = recalculateCart(cart);
  saveCartAndNotify(cart);
};

/**
 * Updates the quantity of a specific item in the cart.
 * If quantity is 0 or less, the item is removed.
 * @param itemId The unique ID of the cart item to update.
 * @param quantity The new quantity for the item.
 * @returns A promise that resolves to an object indicating success and a message.
 */
export const updateQuantity = async (
  itemId: string,
  quantity: number
): Promise<{ success: boolean; message: string }> => {
  if (quantity <= 0) {
    removeFromCart(itemId);
    return { success: true, message: 'Item removed from cart.' };
  }

  const cart = getCart();
  const itemToUpdate = cart.items.find(item => item.id === itemId);

  if (!itemToUpdate) {
    return { success: false, message: 'Item not found in cart.' };
  }

  // Check stock availability
  const productData = await getProductById(itemToUpdate.productId);
  const variant = productData?.variants.find(v => v.id === itemToUpdate.variantId);

  if (!variant) {
    // This indicates data inconsistency; remove the invalid item.
    removeFromCart(itemId);
    return { success: false, message: 'Product data not found. Item removed.' };
  }

  if (quantity > variant.stock) {
    return { success: false, message: `Cannot update quantity. Only ${variant.stock} units available.` };
  }

  itemToUpdate.quantity = quantity;
  const updatedCart = recalculateCart(cart);
  saveCartAndNotify(updatedCart);

  return { success: true, message: 'Cart quantity updated.' };
};

/**
 * Removes all items from the cart.
 */
export const clearCart = (): void => {
  const baseCart = getCart();
  const clearedCart: Cart = {
    items: [],
    itemCount: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    discount: { code: null, amount: 0 },
    isCoOpMember: baseCart.isCoOpMember, // Persist Co-Op member status
  };
  saveCartAndNotify(clearedCart);
};

/**
 * Attempts to apply a discount code to the cart.
 * @param code The discount code to apply.
 * @returns An object indicating success and a message.
 */
export const applyDiscount = (code: string): { success: boolean; message: string } => {
  const cart = getCart();
  const discountInfo = validDiscountCodes[code.toUpperCase()];

  if (!discountInfo) {
    // If an invalid code is entered, we should remove any existing discount.
    if (cart.discount.code) {
        cart.discount = { code: null, amount: 0 };
        const updatedCart = recalculateCart(cart);
        saveCartAndNotify(updatedCart);
        return { success: false, message: 'Invalid discount code. Previous discount removed.' };
    }
    return { success: false, message: 'Invalid discount code.' };
  }

  let discountAmount = 0;
  if (discountInfo.type === 'fixed') {
    discountAmount = discountInfo.value;
  } else if (discountInfo.type === 'percentage') {
    discountAmount = cart.subtotal * (discountInfo.value / 100);
  }

  cart.discount = { code, amount: discountAmount };
  const updatedCart = recalculateCart(cart);
  saveCartAndNotify(updatedCart);

  return { success: true, message: `Discount "${code}" applied successfully.` };
};


/**
 * Sets the Co-Op member status and recalculates the cart.
 * @param isMember Boolean indicating if the user is a Co-Op member.
 */
export const setCoOpStatus = (isMember: boolean): void => {
    const cart = getCart();
    if (cart.isCoOpMember !== isMember) {
        cart.isCoOpMember = isMember;
        const updatedCart = recalculateCart(cart);
        saveCartAndNotify(updatedCart);
    }
};

// =================================================================================
// GETTERS & VALIDATORS
// =================================================================================

/**
 * Retrieves the entire current cart state object.
 * @returns The current cart object.
 */
export const getCartState = (): Cart => {
  return getCart();
};

/**
 * Gets the total number of items in the cart (sum of all quantities).
 * Ideal for updating a cart count badge.
 * @returns {number} The total item count.
 */
export const getCartItemCount = (): number => {
  return getCart().itemCount;
};


/**
 * Gets the final total price of the cart, including discounts and taxes.
 * @returns {number} The final total.
 */
export const getCartTotal = (): number => {
  return getCart().total;
};

/**
 * Checks if the cart meets all conditions for checkout.
 * @returns An object indicating if the cart is valid and an optional message.
 */
export const isCartValidForCheckout = (): { isValid: boolean; message?: string } => {
    const cart = getCart();
    if (cart.items.length === 0) {
        return { isValid: false, message: "Your cart is empty." };
    }
    if (cart.total < MINIMUM_ORDER_VALUE) {
        return { isValid: false, message: `A minimum order value of ₹${MINIMUM_ORDER_VALUE.toFixed(2)} is required.` };
    }
    return { isValid: true };
};

/**
 * Provides the name of the custom event dispatched on cart updates.
 * UI components can listen to this event on the `window` object to react to changes.
 * @example
 * window.addEventListener(getCartUpdateEventName(), (event) => {
 *   const newCartState = event.detail;
 *   // update UI
 * });
 * @returns {string} The event name.
 */
export const getCartUpdateEventName = (): string => {
    return CART_UPDATED_EVENT;
};