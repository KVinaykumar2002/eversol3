"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Loader2, History } from "lucide-react";

// Mock data and types as no real API is available
interface Product {
  id: string;
  name: string;
  price: number;
  url: string;
}

interface Category {
  id: string;
  name: string;
  url: string;
}

interface SearchResults {
  products: Product[];
  categories: Category[];
}

// Data from website content to populate mock results
const mockProducts: Product[] = [
  { id: "1", name: "Organic Rajmudi Rice", price: 152.00, url: "/products/organic-rajmudi-rice" },
  { id: "2", name: "A2 Desi Cow Ghee", price: 625.50, url: "/products/a2-desi-cow-ghee" },
  { id: "3", name: "Organic Tur/Toor Dal", price: 182.00, url: "/products/organic-tur-toor-dal" },
  { id: "4", name: "Cold Pressed - Groundnut Oil", price: 494.00, url: "/products/cold-pressed-groundnut-oil" },
  { id: "5", name: "Organic Moong Dal", price: 162.00, url: "/products/organic-moong-dal" },
];

const mockCategories: Category[] = [
  { id: "1", name: "Staples", url: "/collections/staples" },
  { id: "2", name: "Oils", url: "/collections/oils" },
];

const SearchBar = () => {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);
  
  const allItems = React.useMemo(() => {
    if (!results) return [];
    return [...results.products, ...results.categories];
  }, [results]);

  React.useEffect(() => {
    if (query.trim() === "") {
      setResults(null);
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300)); // Debounce simulation

      const lowerCaseQuery = query.toLowerCase();
      const filteredProducts = mockProducts.filter(p => p.name.toLowerCase().includes(lowerCaseQuery));
      const filteredCategories = mockCategories.filter(c => c.name.toLowerCase().includes(lowerCaseQuery));

      setResults({ products: filteredProducts, categories: filteredCategories });
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    try {
      const storedSearches = localStorage.getItem("eversolRecentSearches");
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches));
      }
    } catch (error) {
      console.error("Could not read recent searches:", error);
    }
  }, []);

  const addRecentSearch = (searchTerm: string) => {
    const term = searchTerm.trim();
    if (!term) return;
    try {
      const updatedSearches = [term, ...recentSearches.filter(s => s.toLowerCase() !== term.toLowerCase())].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem("eversolRecentSearches", JSON.stringify(updatedSearches));
    } catch (error) {
      console.error("Could not save recent search:", error);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchTerm = query.trim();
    if (searchTerm) {
      addRecentSearch(searchTerm);
      router.push(`/search?q=${searchTerm}`);
      setIsFocused(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev < allItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > -1 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
        e.preventDefault();
        const selectedItem = allItems[activeIndex];
        const searchTerm = query.trim();

        if (selectedItem) {
            if (searchTerm) addRecentSearch(searchTerm);
            router.push(selectedItem.url);
        } else if (searchTerm) {
            addRecentSearch(searchTerm);
            router.push(`/search?q=${searchTerm}`);
        }
        setIsFocused(false);
    }
  };
  
  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return (
      <>
        {text.split(regex).map((part, i) =>
          regex.test(part) ? (
            <strong key={i} className="font-bold text-primary">{part}</strong>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };
  
  const showDropdown = isFocused && (query.length > 0 || (query.length === 0 && recentSearches.length > 0));

  return (
    <div className="relative w-full" ref={searchContainerRef}>
      <form onSubmit={handleFormSubmit} className="relative flex items-center w-full bg-background border border-input rounded-sm transition-all duration-300 ease-in-out focus-within:ring-2 focus-within:ring-ring focus-within:border-primary">
          <input
              type="search"
              name="q"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveIndex(-1); }}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
              placeholder="Search for products, categories..."
              autoComplete="off"
              className="w-full h-[46px] px-4 py-3 text-sm text-foreground bg-transparent border-none outline-none focus:ring-0 placeholder:text-muted-foreground"
          />
          {query && !isLoading && (
              <button type="button" onClick={() => { setQuery(""); document.querySelector<HTMLInputElement>('input[name="q"]')?.focus(); }} className="absolute right-14 p-1 text-muted-foreground hover:text-foreground">
                  <X size={18} />
              </button>
          )}
          {isLoading && (
              <div className="absolute right-14 p-1">
                  <Loader2 size={18} className="animate-spin text-muted-foreground" />
              </div>
          )}

          <div className="h-6 w-px bg-input" />

          <button type="submit" aria-label="Search" className="px-4 text-foreground hover:text-primary transition-colors">
              <Search size={20} />
          </button>
      </form>
      
      {showDropdown && (
        <div className="absolute z-50 w-full mt-2 bg-background border rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] overflow-hidden border-border">
          <div className="max-h-[min(60vh,800px)] overflow-y-auto">
            {query.length === 0 && recentSearches.length > 0 ? (
                 <div className="p-2">
                    <h3 className="px-2 py-1 text-xs font-semibold text-muted-foreground flex items-center"><History size={14} className="mr-2"/>RECENT SEARCHES</h3>
                    <ul>
                      {recentSearches.map((term, index) => (
                        <li key={index}>
                          <button onClick={() => setQuery(term)} className="w-full text-left px-2 py-2 rounded-md hover:bg-secondary text-sm text-foreground">
                            {term}
                          </button>
                        </li>
                      ))}
                    </ul>
                </div>
            ) : results && (
              <>
                {results.products.length > 0 && (
                  <div className="p-2">
                    <h3 className="px-2 py-1 text-xs font-semibold text-muted-foreground">SUGGESTED PRODUCTS</h3>
                    <ul>
                      {results.products.map((product, index) => (
                        <li key={product.id} className={`rounded-md ${activeIndex === index ? 'bg-secondary' : ''}`}>
                          <Link href={product.url} className="flex items-center p-2" onClick={() => setIsFocused(false)}>
                            <div className="w-12 h-12 bg-secondary rounded-sm mr-3 flex-shrink-0" />
                            <div className="flex-grow">
                              <p className="text-sm text-foreground">{highlightMatch(product.name, query)}</p>
                              <p className="text-sm font-semibold text-primary">₹{product.price.toFixed(2)}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.categories.length > 0 && (
                  <div className={`p-2 ${results.products.length > 0 ? 'border-t border-border' : ''}`}>
                    <h3 className="px-2 py-1 text-xs font-semibold text-muted-foreground">CATEGORIES</h3>
                    <ul>
                      {results.categories.map((category, index) => (
                        <li key={category.id} className={`rounded-md ${activeIndex === results.products.length + index ? 'bg-secondary' : ''}`}>
                          <Link href={category.url} className="block px-2 py-2 text-sm text-foreground hover:bg-secondary rounded-md" onClick={() => setIsFocused(false)}>
                            {highlightMatch(category.name, query)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.products.length === 0 && results.categories.length === 0 && !isLoading && (
                  <p className="p-6 text-center text-sm text-muted-foreground">No results found for "{query}"</p>
                )}
                 {(results.products.length > 0 || results.categories.length > 0) && (
                   <div className="p-2 border-t border-border">
                      <Link href={`/search?q=${query}`} className="block w-full text-center p-2 text-sm font-semibold text-primary hover:bg-secondary rounded-md" onClick={() => setIsFocused(false)}>
                        View all results for "{query}"
                      </Link>
                   </div>
                 )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;