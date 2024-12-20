"use client";

import { useState, useEffect } from "react";
import { ImageGenerator } from "@/components/generate/image-generator";
import { ImageGallery } from "@/components/shared/image-gallery";
import { useSession } from "next-auth/react";

interface GeneratedImage {
  id: string;
  imageUrl: string;
  createdAt: Date;
  prompt: string;
}

export default function GeneratePage() {
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

  const handleNewImage = (newImage: GeneratedImage) => {
    setImages(prev => [newImage, ...prev]);
  };

  return (
    <div className="container max-w-6xl p-4 space-y-8">
      <ImageGenerator onImageGenerated={handleNewImage} />
      
      <div className="mt-12">
        <ImageGallery 
          title="Your Recent Generations"
          images={images}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
