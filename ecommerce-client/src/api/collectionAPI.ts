import { apiClient } from '@/utils/apiClient';

export async function getAllCollections() {
  try {
    const response = await apiClient.get('/api/Collections');
    // Backend returns array directly, not wrapped in response object
    const collections = Array.isArray(response) ? response : (response.data || []);
    
    // Map backend response to match client expectations
    return collections.map((collection: any) => ({
      id: collection.id,
      name: collection.name,
      description: collection.description,
      image: collection.imageUrl || collection.image, // Backend uses 'imageUrl'
      createdAt: collection.createdAt,
      products: collection.products || []
    }));
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
}
