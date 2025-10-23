import { apiClient } from '@/utils/apiClient';

export async function getWishlist(token: string) {
  try {
    return await apiClient.get('/api/Wishlist/Customer', token);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return { success: false, data: [], message: 'Failed to fetch wishlist' };
  }
}

export async function addItemToWishlist(
  productId: number,
  productVariantId: number,
  token: string
) {
  try {
    return await apiClient.post(
      '/api/Wishlist',
      { productId, productVariantId },
      token
    );
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    return { success: false, message: 'Failed to add item to wishlist' };
  }
}

export async function removeItemFromWishlist(
  productVariantId: number,
  token: string
) {
  try {
    return await apiClient.delete(`/api/Wishlist/${productVariantId}`, token);
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    return { success: false, message: 'Failed to remove item from wishlist' };
  }
}
