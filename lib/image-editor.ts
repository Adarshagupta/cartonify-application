export class ImageEditor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private image: HTMLImageElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas context');
    this.ctx = context;
    this.image = new Image();
  }

  loadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.image.onload = () => {
        this.resetCanvas();
        resolve();
      };
      this.image.onerror = reject;
      this.image.src = src;
    });
  }

  private resetCanvas() {
    const { width, height } = this.calculateDimensions();
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.drawImage(this.image, 0, 0, width, height);
  }

  private calculateDimensions() {
    const maxWidth = this.canvas.clientWidth;
    const maxHeight = this.canvas.clientHeight;
    let width = this.image.width;
    let height = this.image.height;

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width *= ratio;
      height *= ratio;
    }

    return { width, height };
  }

  applyFilters(filters: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    rotation: number;
  }) {
    this.resetCanvas();
    
    // Apply filters
    this.ctx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      blur(${filters.blur}px)
    `;

    // Apply rotation
    if (filters.rotation !== 0) {
      const { width, height } = this.canvas;
      this.ctx.translate(width / 2, height / 2);
      this.ctx.rotate((filters.rotation * Math.PI) / 180);
      this.ctx.translate(-width / 2, -height / 2);
    }

    this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
  }

  export(): string {
    return this.canvas.toDataURL('image/png');
  }
}
