"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Download, Settings2 } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface GeneratedImage {
  id: string;
  imageUrl: string;
  createdAt: Date;
  prompt: string;
}

interface ImageGeneratorProps {
  onImageGenerated?: (image: GeneratedImage) => void;
}

interface AdvancedSettings {
  size: string;
  style: string;
  quality: number;
  enhancePrompt: boolean;
  negativePrompt: string;
  seed: number;
  modelVersion: string;
}

export function ImageGenerator({ onImageGenerated }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [settings, setSettings] = useState<AdvancedSettings>({
    size: "1024x1024",
    style: "natural",
    quality: 75,
    enhancePrompt: true,
    negativePrompt: "",
    seed: -1,
    modelVersion: "v2",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          ...settings,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setGeneratedImage(data.imageUrl);
      
      if (onImageGenerated) {
        onImageGenerated({
          id: data.id,
          imageUrl: data.imageUrl,
          prompt: prompt,
          createdAt: new Date(),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = async (imageUrl: string) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">AI Image Generator</h1>
          <p className="text-sm text-muted-foreground">
            Enter a prompt to generate an image using AI
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            disabled={isGenerating}
            className="flex-1"
          />
          <Button type="submit" disabled={isGenerating || !prompt.trim()}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value="advanced-settings">
            <AccordionTrigger>Advanced Settings</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Image Size</Label>
                  <Select
                    value={settings.size}
                    onValueChange={(value) => setSettings({ ...settings, size: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="256x256">256x256</SelectItem>
                      <SelectItem value="512x512">512x512</SelectItem>
                      <SelectItem value="1024x1024">1024x1024</SelectItem>
                      <SelectItem value="1024x1792">1024x1792 (Portrait)</SelectItem>
                      <SelectItem value="1792x1024">1792x1024 (Landscape)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Style</Label>
                  <Select
                    value={settings.style}
                    onValueChange={(value) => setSettings({ ...settings, style: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural">Natural</SelectItem>
                      <SelectItem value="artistic">Artistic</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="photographic">Photographic</SelectItem>
                      <SelectItem value="digital-art">Digital Art</SelectItem>
                      <SelectItem value="oil-painting">Oil Painting</SelectItem>
                      <SelectItem value="watercolor">Watercolor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Model Version</Label>
                  <Select
                    value={settings.modelVersion}
                    onValueChange={(value) => setSettings({ ...settings, modelVersion: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v1">Version 1</SelectItem>
                      <SelectItem value="v2">Version 2 (Recommended)</SelectItem>
                      <SelectItem value="v3">Version 3 (Beta)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Quality ({settings.quality}%)</Label>
                  <Slider
                    value={[settings.quality]}
                    onValueChange={(value) => setSettings({ ...settings, quality: value[0] })}
                    min={1}
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Negative Prompt</Label>
                  <Input
                    value={settings.negativePrompt}
                    onChange={(e) => setSettings({ ...settings, negativePrompt: e.target.value })}
                    placeholder="Elements to avoid in the generation..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Seed</Label>
                  <Input
                    type="number"
                    value={settings.seed}
                    onChange={(e) => setSettings({ ...settings, seed: parseInt(e.target.value) })}
                    placeholder="Random seed (-1 for random)"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.enhancePrompt}
                    onCheckedChange={(checked) => setSettings({ ...settings, enhancePrompt: checked })}
                  />
                  <Label>Enhance Prompt</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {generatedImage && (
          <div className="relative aspect-square w-full max-w-2xl mx-auto mt-8 rounded-lg overflow-hidden">
            <Image
              src={generatedImage}
              alt={prompt}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {generatedImage && (
          <Button
            onClick={() => downloadImage(generatedImage)}
            className="mt-2"
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Image
          </Button>
        )}
      </form>
    </Card>
  );
}
