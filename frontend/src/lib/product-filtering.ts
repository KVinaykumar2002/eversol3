// src/lib/product-filtering.ts

// --- TYPE DEFINITIONS ---

/**
 * Represents a product in the store. This is a sample structure;
 * it should be adapted to match the actual product data model.
 */
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  createdAt: Date; // For sorting by "newest"
  popularity: number; // For sorting by "popular", e.g., sales count or views
  imageUrl: string;
  // Other potential fields: description, variants, ratings, etc.
}

/**
 * Defines the available sorting criteria for products.
 */
export type SortCriteria =
  | 'relevance' // Default, especially for search
  | 'price-low-to-high'
  | 'price-high-to-low'
  | 'newest'
  | 'popular';

/**
 * Represents the state of all active filters, sorting, and search options.
 * This structure is designed to be easily synchronized with URL query parameters.
 */
export interface Filters {
  searchQuery?: string;
  categories?: string[];
  priceRange?: [number, number];
  availability?: boolean;
  sortBy: SortCriteria;
}

/**
 * Represents the result of applying filters and pagination.
 */
export interface PaginatedProducts {
  products: Product[];
  totalProducts: number;
  totalPages: number;
  currentPage: number;
}


// --- CONSTANTS ---

/**
 * The default state for filters, used for initialization and for clearing all filters.
 */
export const initialFilters: Filters = {
  sortBy: 'relevance',
};


// --- UTILITY/HELPER FUNCTIONS ---

/**
 * Counts the number of active filters. Useful for displaying filter count badges in the UI.
 * This selectively counts filters that are considered "active" by the user.
 * @param filters - The current filter state object.
 * @returns The number of active filters.
 */
export const countActiveFilters = (filters: Filters): number => {
  let count = 0;
  if (filters.categories && filters.categories.length > 0) {
    count++;
  }
  if (filters.priceRange) {
    count++;
  }
  if (filters.availability) {
    count++;
  }
  // `searchQuery` and `sortBy` are often treated separately from explicit filters.
  return count;
};


// --- CORE FILTERING AND SORTING LOGIC ---

/**
 * Filters a list of products based on a search query.
 * The search is case-insensitive and checks against the product name and category.
 * @param products - The array of products to search within.
 * @param query - The search term. Can be an empty string.
 * @returns A new array of products that match the query.
 * @remarks For optimal UI performance, the call to this function should be debounced.
 */
export const searchProducts = (products: Product[], query: string): Product[] => {
  if (!query) {
    return products;
  }
  const lowercasedQuery = query.toLowerCase().trim();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercasedQuery) ||
      product.category.toLowerCase().includes(lowercasedQuery)
  );
};

/**
 * Filters products by one or more categories.
 * @param products - The array of products to filter.
 * @param categories - An array of category names to include.
 * @returns A new array of products belonging to the specified categories.
 */
export const filterByCategory = (products: Product[], categories: string[]): Product[] => {
    if (!categories || categories.length === 0) {
        return products;
    }
    const categorySet = new Set(categories.map(c => c.toLowerCase()));
    return products.filter(product => categorySet.has(product.category.toLowerCase()));
};

/**
 * Filters products to be within a specific price range (inclusive).
 * @param products - The array of products to filter.
 * @param range - A tuple `[min, max]` representing the price range.
 * @returns A new array of products within the specified price range.
 */
export const filterByPrice = (products: Product[], range: [number, number]): Product[] => {
    const [min, max] = range;
    return products.filter(product => product.price >= min && product.price <= max);
};

/**
 * Filters products based on their stock availability.
 * @param products - The array of products to filter.
 * @returns A new array of products that are marked as `inStock: true`.
 */
export const filterByAvailability = (products: Product[]): Product[] => {
    return products.filter(product => product.inStock);
};

/**
 * Sorts an array of products based on a given criterion.
 * @param products - The array of products to sort.
 * @param criteria - The sorting criterion.
 * @returns A new, sorted array of products. The original array is not mutated.
 */
export const sortBy = (products: Product[], criteria: SortCriteria): Product[] => {
  const sortedProducts = [...products]; // Avoid mutating the original array.
  switch (criteria) {
    case 'price-low-to-high':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price-high-to-low':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'newest':
      return sortedProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    case 'popular':
      return sortedProducts.sort((a, b) => b.popularity - a.popularity);
    case 'relevance':
    default:
      // By default, or for 'relevance', we maintain the current order,
      // which might be determined by the search algorithm's own relevance scoring.
      return sortedProducts;
  }
};

// --- ORCHESTRATION FUNCTIONS ---

/**
 * Applies a combination of filters, search, and sorting to a list of products.
 * This is the main function to call to get a filtered and sorted product list.
 * The operations are chained in a logical order for efficiency.
 * @param allProducts - The initial full list of products from the data source.
 * @param filters - An object containing all filter, search, and sort criteria.
 * @returns A new array of products that match all applied filters and are sorted.
 * @remarks In a React component, wrap the call to this function in `useMemo` to prevent
 *          unnecessary re-computation on every render.
 */
export const applyMultipleFilters = (
    allProducts: readonly Product[],
    filters: Filters
): Product[] => {
    let filteredProducts = [...allProducts];

    if (filters.searchQuery) {
        filteredProducts = searchProducts(filteredProducts, filters.searchQuery);
    }
    if (filters.categories && filters.categories.length > 0) {
        filteredProducts = filterByCategory(filteredProducts, filters.categories);
    }
    if (filters.availability) {
        filteredProducts = filterByAvailability(filteredProducts);
    }
    if (filters.priceRange) {
        filteredProducts = filterByPrice(filteredProducts, filters.priceRange);
    }

    // Sorting is applied last to the final filtered list.
    filteredProducts = sortBy(filteredProducts, filters.sortBy);

    return filteredProducts;
};


// --- PAGINATION ---

/**
 * Paginates a given array of products. Typically used on the result of `applyMultipleFilters`.
 * @param products - The filtered and sorted array of products to a paginate.
 * @param page - The current page number (1-indexed).
 * @param pageSize - The number of items to display per page.
 * @returns An object containing the products for the current page and pagination metadata.
 */
export const getProductPage = (
    products: readonly Product[],
    page: number,
    pageSize: number
): PaginatedProducts => {
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / pageSize);
    const currentPage = Math.min(Math.max(1, page), totalPages || 1);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const pageData = products.slice(startIndex, endIndex);

    return {
        products: pageData,
        totalProducts,
        totalPages,
        currentPage,
    };
};