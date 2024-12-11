'use client';

import { useState, useRef, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  ImageIcon, 
  Crop, 
  SunMedium, 
  Contrast, 
  Palette,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Sparkles,
  Paintbrush,
  Type,
  Download,
  Undo,
  Redo,
  Sliders,
  ImagePlus,
  Circle,
  Square,
  Minus,
  Plus,
  Eraser,
  PenTool,
  Droplet,
  Layers,
  Move,
  Scissors
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DrawPosition {
  x: number;
  y: number;
}

export default function ImageEditorPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("adjust");
  const [drawingColor, setDrawingColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState<'brush' | 'eraser' | 'shape'>('brush');
  const [selectedShape, setSelectedShape] = useState<'circle' | 'square' | 'line'>('circle');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [startPos, setStartPos] = useState<DrawPosition | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    rotation: 0,
    hue: 0,
    sepia: 0,
    opacity: 100,
    grayscale: 0,
    sharpen: 0
  });

  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
        setHistory([result]);
        setHistoryIndex(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSelectedImage(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSelectedImage(history[historyIndex + 1]);
    }
  };

  useEffect(() => {
    if (selectedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        setImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      };
      img.src = selectedImage;
    }
  }, [selectedImage]);

  const drawShape = (
    ctx: CanvasRenderingContext2D,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    ctx.beginPath();
    if (selectedShape === 'circle') {
      const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
    } else if (selectedShape === 'square') {
      const width = endX - startX;
      const height = endY - startY;
      ctx.rect(startX, startY, width, height);
    } else if (selectedShape === 'line') {
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
    }
    ctx.stroke();
  };

  const handleDrawStart = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStartPos({ x, y });
    setImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = drawingColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
  };

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current || !startPos || !imageData) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (drawingMode === 'brush' || drawingMode === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (drawingMode === 'shape') {
      ctx.putImageData(imageData, 0, 0);
      drawShape(ctx, startPos.x, startPos.y, x, y);
    }
  };

  const handleDrawEnd = () => {
    if (!isDrawing || !canvasRef.current) return;
    setIsDrawing(false);
    
    // Save state to history
    const newState = canvasRef.current.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const applyFilter = (filter: string, value: number) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
  };

  const filterPresets = [
    { name: 'Original', filters: { brightness: 100, contrast: 100, saturation: 100, sepia: 0, grayscale: 0 } },
    { name: 'Vivid', filters: { brightness: 110, contrast: 120, saturation: 130, sepia: 0, grayscale: 0 } },
    { name: 'B&W', filters: { brightness: 100, contrast: 110, saturation: 0, sepia: 0, grayscale: 100 } },
    { name: 'Sepia', filters: { brightness: 100, contrast: 100, saturation: 90, sepia: 80, grayscale: 0 } },
    { name: 'Vintage', filters: { brightness: 90, contrast: 90, saturation: 80, sepia: 30, grayscale: 20 } },
    { name: 'Cool', filters: { brightness: 100, contrast: 100, saturation: 90, hue: 180, grayscale: 0 } },
    { name: 'Warm', filters: { brightness: 105, contrast: 100, saturation: 110, hue: -30, grayscale: 0 } },
    { name: 'Sharp', filters: { brightness: 105, contrast: 120, saturation: 110, sharpen: 50, grayscale: 0 } },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Image Editor</h1>
          {selectedImage && (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Undo className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Redo className="h-5 w-5" />
              </Button>
              <Button>
                <Download className="h-5 w-5 mr-2" />
                Export
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="flex flex-col h-[calc(100vh-12rem)]">
          {/* Main Editor Area */}
          <div className="flex-1 bg-muted rounded-lg mb-4 relative overflow-hidden">
            {!selectedImage ? (
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                <div className="p-6 rounded-full bg-background shadow-lg">
                  <ImagePlus size={48} className="text-muted-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-semibold">Start Editing</h2>
                  <p className="text-muted-foreground">Upload an image to begin editing</p>
                  <label className="cursor-pointer">
                    <Button className="gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Choose Image
                    </Button>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleDrawStart}
                  onMouseMove={handleDraw}
                  onMouseUp={handleDrawEnd}
                  onMouseLeave={handleDrawEnd}
                  className="w-full h-full object-contain"
                  style={{
                    filter: `
                      brightness(${filters.brightness}%)
                      contrast(${filters.contrast}%)
                      saturate(${filters.saturation}%)
                      blur(${filters.blur}px)
                      hue-rotate(${filters.hue}deg)
                      sepia(${filters.sepia}%)
                      opacity(${filters.opacity}%)
                      grayscale(${filters.grayscale}%)
                    `
                  }}
                />
              </div>
            )}
          </div>

          {/* Enhanced Editing Tools */}
          {selectedImage && (
            <div className="bg-muted rounded-lg p-4">
              <Tabs defaultValue="adjust" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-6 gap-4 bg-transparent">
                  <TabsTrigger value="adjust">
                    <Sliders className="h-5 w-5 mr-2" />
                    Adjust
                  </TabsTrigger>
                  <TabsTrigger value="filters">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Filters
                  </TabsTrigger>
                  <TabsTrigger value="draw">
                    <PenTool className="h-5 w-5 mr-2" />
                    Draw
                  </TabsTrigger>
                  <TabsTrigger value="shapes">
                    <Circle className="h-5 w-5 mr-2" />
                    Shapes
                  </TabsTrigger>
                  <TabsTrigger value="transform">
                    <Move className="h-5 w-5 mr-2" />
                    Transform
                  </TabsTrigger>
                  <TabsTrigger value="effects">
                    <Layers className="h-5 w-5 mr-2" />
                    Effects
                  </TabsTrigger>
                </TabsList>

                <div className="mt-4">
                  {/* Adjust Tab Content */}
                  <TabsContent value="adjust" className="space-y-4">
                    {Object.entries(filters).map(([key, value]) => (
                      <div key={key}>
                        <label className="text-sm font-medium mb-2 block capitalize">
                          {key}
                        </label>
                        <Slider
                          value={[value]}
                          onValueChange={(val) => applyFilter(key, val[0])}
                          min={key === 'hue' ? -180 : 0}
                          max={key === 'hue' ? 180 : 200}
                          step={1}
                        />
                      </div>
                    ))}
                  </TabsContent>

                  {/* Draw Tab Content */}
                  <TabsContent value="draw" className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-[100px] h-[40px]" style={{ backgroundColor: drawingColor }}>
                            <Droplet className="h-4 w-4 mr-2" />
                            Color
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <HexColorPicker color={drawingColor} onChange={setDrawingColor} />
                        </PopoverContent>
                      </Popover>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant={drawingMode === 'brush' ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => setDrawingMode('brush')}
                        >
                          <PenTool className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={drawingMode === 'eraser' ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => setDrawingMode('eraser')}
                        >
                          <Eraser className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setBrushSize(Math.max(1, brushSize - 1))}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{brushSize}</span>
                        <Button variant="outline" size="icon" onClick={() => setBrushSize(Math.min(50, brushSize + 1))}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Shapes Tab Content */}
                  <TabsContent value="shapes" className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        variant={selectedShape === 'circle' ? 'default' : 'outline'}
                        onClick={() => setSelectedShape('circle')}
                      >
                        <Circle className="h-4 w-4 mr-2" />
                        Circle
                      </Button>
                      <Button
                        variant={selectedShape === 'square' ? 'default' : 'outline'}
                        onClick={() => setSelectedShape('square')}
                      >
                        <Square className="h-4 w-4 mr-2" />
                        Square
                      </Button>
                      <Button
                        variant={selectedShape === 'line' ? 'default' : 'outline'}
                        onClick={() => setSelectedShape('line')}
                      >
                        <Minus className="h-4 w-4 mr-2" />
                        Line
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Transform Tab Content */}
                  <TabsContent value="transform" className="space-y-4">
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setFilters({ ...filters, rotation: filters.rotation - 90 })}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" onClick={() => setFilters({ ...filters, rotation: filters.rotation + 90 })}>
                        <RotateCw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline">
                        <FlipHorizontal className="h-4 w-4" />
                      </Button>
                      <Button variant="outline">
                        <FlipVertical className="h-4 w-4" />
                      </Button>
                      <Button variant="outline">
                        <Crop className="h-4 w-4" />
                      </Button>
                      <Button variant="outline">
                        <Scissors className="h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Effects Tab Content */}
                  <TabsContent value="effects">
                    <div className="grid grid-cols-4 gap-4">
                      {filterPresets.map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          className="aspect-square flex flex-col items-center justify-center gap-2"
                          onClick={() => setFilters({ ...filters, ...preset.filters })}
                        >
                          <div className="w-full h-12 bg-muted-foreground/20 rounded" />
                          <span className="text-sm">{preset.name}</span>
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
