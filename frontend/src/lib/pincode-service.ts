/**
 * This service handles pincode validation, delivery serviceability checks,
 * and location detection. It uses mock data and simulates API calls.
 * Functions that interact with browser APIs (localStorage, navigator) are
 * intended for client-side use only and should not be used in Server Components.
 */

// --- TYPE DEFINITIONS ---

export interface PincodeDetails {
  pincode: string;
  city: string;
  state: string;
  serviceable: boolean;
  deliveryEstimate: string | null;
  codAvailable: boolean;
}

export interface PincodeServiceError {
  type: 'Validation' | 'ApiService' | 'NotServiceable' | 'GeolocationPermission' | 'GeolocationError';
  message: string;
}

// --- MOCK DATA & CONSTANTS ---

const MOCK_API_DELAY = 500; // ms to simulate network latency

// A mock database of serviceable pincodes and their details.
const SERVICEABLE_PINCODES: Record<string, Omit<PincodeDetails, 'pincode' | 'serviceable'>> = {
  '560001': { city: 'Bengaluru', state: 'Karnataka', deliveryEstimate: 'Next business day', codAvailable: true },
  '560038': { city: 'Bengaluru', state: 'Karnataka', deliveryEstimate: '1-2 business days', codAvailable: true },
  '571401': { city: 'Mandya', state: 'Karnataka', deliveryEstimate: 'Next business day', codAvailable: false },
  '110001': { city: 'New Delhi', state: 'Delhi', deliveryEstimate: '2-3 business days', codAvailable: true },
  '400001': { city: 'Mumbai', state: 'Maharashtra', deliveryEstimate: '2-3 business days', codAvailable: true },
};

// A mock database for a broader range of pincodes (including non-serviceable ones)
// This simulates a general pincode lookup API.
const ALL_PINCODES: Record<string, { city: string; state: string }> = {
  ...SERVICEABLE_PINCODES,
  '800001': { city: 'Patna', state: 'Bihar' },
  '700001': { city: 'Kolkata', state: 'West Bengal' },
};

const PINCODE_REGEX = /^[1-9][0-9]{5}$/;
const SAVED_PINCODE_LOCAL_STORAGE_KEY = 'eversol_pincode';

// In-memory cache for pincode lookup results to avoid redundant "API" calls.
const pincodeCache = new Map<string, PincodeDetails>();


// --- CORE SERVICE FUNCTIONS ---

/**
 * Validates the format of an Indian pincode.
 * @param pincode - The 6-digit pincode string.
 * @returns `true` if the pincode format is valid, otherwise `false`.
 */
export const validatePincode = (pincode: string): boolean => {
  return PINCODE_REGEX.test(pincode);
};

/**
 * Fetches details for a given pincode, including serviceability.
 * This function simulates an API call and implements caching.
 * @param pincode - The 6-digit pincode string.
 * @returns A promise that resolves with PincodeDetails.
 * @throws A PincodeServiceError if pincode is invalid or not found.
 */
const getPincodeDetails = async (pincode: string): Promise<PincodeDetails> => {
  if (!validatePincode(pincode)) {
    throw {
      type: 'Validation',
      message: 'Invalid pincode format. Please enter a 6-digit pincode.',
    } as PincodeServiceError;
  }

  if (pincodeCache.has(pincode)) {
    return pincodeCache.get(pincode)!;
  }

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const generalInfo = ALL_PINCODES[pincode];
      if (!generalInfo) {
        return reject({
          type: 'ApiService',
          message: 'Pincode not found. Please check and try again.',
        } as PincodeServiceError);
      }

      const serviceInfo = SERVICEABLE_PINCODES[pincode];
      const details: PincodeDetails = {
        pincode,
        city: generalInfo.city,
        state: generalInfo.state,
        serviceable: !!serviceInfo,
        deliveryEstimate: serviceInfo?.deliveryEstimate || null,
        codAvailable: serviceInfo?.codAvailable || false,
      };

      pincodeCache.set(pincode, details);
      resolve(details);
    }, MOCK_API_DELAY);
  });
};

/**
 * A convenience function that specifically checks if delivery is available.
 * It also checks for COD availability and provides a delivery estimate.
 * @param pincode - The 6-digit pincode string.
 * @returns A promise that resolves with availability details.
 * @throws A PincodeServiceError for invalid or non-serviceable pincodes.
 */
export const checkDeliveryAvailability = async (pincode: string): Promise<Pick<PincodeDetails, 'serviceable' | 'deliveryEstimate' | 'codAvailable' | 'city' | 'state'>> => {
  const details = await getPincodeDetails(pincode);

  if (!details.serviceable) {
    throw {
      type: 'NotServiceable',
      message: `Sorry, delivery is not available for ${details.city} (${pincode}) yet.`,
    } as PincodeServiceError;
  }

  return {
    serviceable: details.serviceable,
    deliveryEstimate: details.deliveryEstimate,
    codAvailable: details.codAvailable,
    city: details.city,
    state: details.state,
  };
};

/**
 * A wrapper for getPincodeDetails to provide a simple address lookup.
 * @param pincode The pincode to look up.
 * @returns A promise resolving to an object with city and state.
 */
export const pincodeToAddress = async (pincode: string): Promise<{ city: string; state: string }> => {
    const { city, state } = await getPincodeDetails(pincode);
    return { city, state };
};


// --- BROWSER-SPECIFIC FUNCTIONS (CLIENT-SIDE ONLY) ---

/**
 * Saves the user's selected pincode to localStorage and sessionStorage.
 * Should only be called in a client-side environment.
 * @param pincode - The pincode string to save.
 */
export const savePincode = (pincode: string): void => {
  if (typeof window !== 'undefined' && window.localStorage && window.sessionStorage) {
    try {
      window.localStorage.setItem(SAVED_PINCODE_LOCAL_STORAGE_KEY, pincode);
      window.sessionStorage.setItem(SAVED_PINCODE_LOCAL_STORAGE_KEY, pincode);
    } catch (error) {
      console.error('Failed to save pincode to storage:', error);
    }
  }
};

/**
 * Retrieves the saved pincode from localStorage.
 * Should only be called in a client-side environment.
 * @returns The saved pincode string, or `null` if not found or not in a browser.
 */
export const getSavedPincode = (): string | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem(SAVED_PINCODE_LOCAL_STORAGE_KEY);
  }
  return null;
};

/**
 * Tries to detect the user's location using the browser's Geolocation API,
 * then reverse geocodes it to a pincode.
 * Should only be called in a client-side environment on user interaction.
 * @returns A promise that resolves with the detected pincode.
 * @throws A PincodeServiceError on permission denial or other errors.
 */
export const detectLocation = (): Promise<string> => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
        return Promise.reject({
            type: 'GeolocationError',
            message: 'Geolocation is not supported by your browser.',
        } as PincodeServiceError);
    }

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const pincode = await mockReverseGeocode(latitude, longitude);
                    resolve(pincode);
                } catch (error) {
                    reject(error);
                }
            },
            (error) => {
                let serviceError: PincodeServiceError;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        serviceError = {
                            type: 'GeolocationPermission',
                            message: 'Location access was denied. Please enable it in your browser settings.',
                        };
                        break;
                    case error.POSITION_UNAVAILABLE:
                        serviceError = {
                            type: 'GeolocationError',
                            message: 'Location information is unavailable.',
                        };
                        break;
                    case error.TIMEOUT:
                        serviceError = {
                            type: 'GeolocationError',
                            message: 'The request to get user location timed out.',
                        };
                        break;
                    default:
                        serviceError = {
                            type: 'GeolocationError',
                            message: 'An unknown error occurred while detecting location.',
                        };
                        break;
                }
                reject(serviceError);
            }
        );
    });
};

/**
 * Mocks a reverse geocoding API call. In a real app, this would use an
 * external service like Google Maps Geocoding API.
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns A promise that resolves to a pincode string.
 */
const mockReverseGeocode = (lat: number, lon: number): Promise<string> => {
    return new Promise((resolve) => {
        // Simple mock logic: return a pincode based on proximity to a known city.
        // Bengaluru coordinates: ~12.97, 77.59
        if (Math.abs(lat - 12.97) < 1 && Math.abs(lon - 77.59) < 1) {
            resolve('560001');
        } 
        // Mandya coordinates: ~12.52, 76.89
        else if (Math.abs(lat - 12.52) < 0.5 && Math.abs(lon - 76.89) < 0.5) {
             resolve('571401');
        }
        else {
            // Default pincode if no match
            resolve('110001'); // New Delhi
        }
    });
};