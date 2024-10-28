import Image from 'next/image';
import { Card } from "@/components/ui/card";

interface GeneratedImage {
  id: string;
  imageUrl: string;
  createdAt: Date;
  prompt: string;
}

interface ImageGalleryProps {
  title?: string;
  images: GeneratedImage[];
  isLoading?: boolean;
  error?: string | null;
}

export function ImageGallery({ title = "Generated Images", images, isLoading, error }: ImageGalleryProps) {
  if (isLoading) {
    return <div className="flex justify-center p-8">Loading your images...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  if (images.length === 0) {
    return (
      <div className="text-center p-8">
        <p>No generated images yet.</p>
        <p className="text-sm text-gray-500 mt-2">
          Try generating some images with the AI Image Generator!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden">
            <div className="relative h-64 w-full">
              <Image
                src={image.imageUrl}
                alt={image.prompt}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground">
                {new Date(image.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2 text-sm line-clamp-2">{image.prompt}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
