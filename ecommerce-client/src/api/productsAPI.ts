import { apiClient } from '@/utils/apiClient';

// SearchProducts
export async function getProducts(
  query: string,
  collection: string,
  token: string
) {
  try {
    const params = new URLSearchParams();
    if (query) params.append('searchQuery', query);
    if (collection) params.append('collections', collection);
    
    return await apiClient.get(
      `/api/products/SearchProducts?${params.toString()}`,
      token
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, message: 'Failed to fetch products', data: [] };
  }
}

// Cache for product details
const productCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getProductById(productId: string, token: string) {
  try {
    // Check cache first
    const cachedProduct = productCache.get(productId);
    if (cachedProduct && Date.now() - cachedProduct.timestamp < CACHE_DURATION) {
      return cachedProduct.data;
    }

    const data = await apiClient.get(
      `/api/products/${productId}`,
      token,
      { timeout: 5000 } // 5 second timeout
    );
    
    // Update cache
    productCache.set(productId, {
      data,
      timestamp: Date.now()
    });

    return data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
}

export async function getProductReccomendation(
  productId: number,
  token: string
) {
  try {
    return await apiClient.get(
      `/api/products/${productId}/recommendations`,
      token
    );
  } catch (error) {
    console.error('Error fetching product recommendations:', error);
    return { success: false, data: [], message: 'Failed to fetch recommendations' };
  }
}

export async function AddReveiwToProduct(
  productId: number,
  rating: number,
  review: string,
  token: string
) {
  try {
    return await apiClient.post(
      '/api/ProductReviews',
      { productId, rating, review },
      token
    );
  } catch (error) {
    console.error('Error adding review:', error);
    return { success: false, message: 'Failed to add review' };
  }
}

export async function GetSuggestionProducts(query: string) {
  try {
    const response = await apiClient.get(`/api/Products/Suggestion/${query}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching product suggestions:', error);
    return [];
  }
}

export async function SearchProducts(query: string) {
  try {
    const response = await apiClient.get(`/api/Products/Search/${query}`);
    return response.data || [];
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

interface FilterParams {
  searchQuery?: string;
  collections?: number[];
  category?: string[];
  subCategory?: string[];
  colors?: string[];
  sizes?: string[];
  rating?: number[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
}

export async function searchAndFilterProducts(params: FilterParams) {
  try {
    const queryParams = new URLSearchParams();

    if (params.searchQuery) queryParams.append('searchQuery', params.searchQuery);
    if (params.collections?.length) params.collections.forEach(id => queryParams.append('collections', id.toString()));
    if (params.category?.length) params.category.forEach(cat => queryParams.append('category', cat));
    if (params.subCategory?.length) params.subCategory.forEach(subCat => queryParams.append('subCategory', subCat));
    if (params.colors?.length) params.colors.forEach(color => queryParams.append('colors', color));
    if (params.sizes?.length) params.sizes.forEach(size => queryParams.append('sizes', size));
    if (params.rating?.length) params.rating.forEach(rating => queryParams.append('rating', rating.toString()));
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());

    return await apiClient.get(`/api/Products/SearchProducts?${queryParams.toString()}`);
  } catch (error) {
    console.error('Error searching and filtering products:', error);
    return { success: false, data: [], message: 'Failed to search products' };
  }
}
