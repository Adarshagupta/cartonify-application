import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ImageGallery } from '@/components/shared/image-gallery';

interface GeneratedImage {
  id: string;
  imageUrl: string;
  createdAt: Date;
  prompt: string;
}

export function GeneratedImages() {
  const { data: session } = useSession();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGeneratedImages() {
      if (!session?.user?.email) return;
      
      try {
        const response = await fetch(`/api/images/user-generated`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch images');
        }
        
        setImages(data);
      } catch (error) {
        console.error('Error fetching generated images:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch images');
      } finally {
        setIsLoading(false);
      }
    }

    fetchGeneratedImages();
  }, [session]);

  return (
    <ImageGallery 
      title="Your Generated Images"
      images={images}
      isLoading={isLoading}
      error={error}
    />
  );
}
