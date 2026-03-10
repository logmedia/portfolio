'use client';

export type ImageFormat = 'webp' | 'jpeg' | 'png';

export type ImagePreset = 'thumbnail' | 'medium' | 'large' | 'fullhd' | 'original';

export const PRESETS: Record<ImagePreset, { label: string; maxWidth: number }> = {
  thumbnail: { label: 'Miniatura (300px)', maxWidth: 300 },
  medium: { label: 'Médio (800px)', maxWidth: 800 },
  large: { label: 'Grande (1200px)', maxWidth: 1200 },
  fullhd: { label: 'Full HD (1920px)', maxWidth: 1920 },
  original: { label: 'Original', maxWidth: 0 },
};

export const FORMAT_LABELS: Record<ImageFormat, string> = {
  webp: 'WebP (recomendado)',
  jpeg: 'JPEG',
  png: 'PNG',
};

export interface ProcessOptions {
  format: ImageFormat;
  preset: ImagePreset;
  quality: number; // 0.1 to 1.0
}

export interface ProcessResult {
  blob: Blob;
  width: number;
  height: number;
  size: number;
  filename: string;
}

export const DEFAULT_OPTIONS: ProcessOptions = {
  format: 'webp',
  preset: 'large',
  quality: 0.85,
};

function getMimeType(format: ImageFormat): string {
  switch (format) {
    case 'webp': return 'image/webp';
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
  }
}

function getExtension(format: ImageFormat): string {
  switch (format) {
    case 'webp': return '.webp';
    case 'jpeg': return '.jpg';
    case 'png': return '.png';
  }
}

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export async function processImage(
  file: File,
  options: ProcessOptions
): Promise<ProcessResult> {
  const img = await loadImage(file);
  
  const maxWidth = PRESETS[options.preset].maxWidth;
  
  let targetWidth = img.naturalWidth;
  let targetHeight = img.naturalHeight;
  
  // Redimensionar se necessário
  if (maxWidth > 0 && targetWidth > maxWidth) {
    const ratio = maxWidth / targetWidth;
    targetWidth = maxWidth;
    targetHeight = Math.round(targetHeight * ratio);
  }
  
  // Criar canvas e desenhar
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D não suportado');
  
  // Fundo branco para JPEG (não suporta transparência)
  if (options.format === 'jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }
  
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  
  // Limpar URL temporária
  URL.revokeObjectURL(img.src);
  
  // Converter para Blob
  const mime = getMimeType(options.format);
  const quality = options.format === 'png' ? undefined : options.quality;
  
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => b ? resolve(b) : reject(new Error('Falha ao converter imagem')),
      mime,
      quality
    );
  });
  
  // Gerar nome do arquivo
  const baseName = file.name.replace(/\.[^.]+$/, '');
  const ext = getExtension(options.format);
  const filename = `${baseName}${ext}`;
  
  return {
    blob,
    width: targetWidth,
    height: targetHeight,
    size: blob.size,
    filename,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
