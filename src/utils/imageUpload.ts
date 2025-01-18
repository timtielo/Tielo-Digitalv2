const IMAGE_STORAGE_KEY = 'blog_images';
const MAX_IMAGE_SIZE = 800; // Max width/height in pixels
const JPEG_QUALITY = 0.85; // Good balance between quality and file size

interface StoredImage {
  id: string;
  url: string;
  originalName: string;
  createdAt: string;
}

export async function uploadImage(file: File): Promise<StoredImage> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload an image file');
  }

  // Convert to optimized JPEG
  const optimizedImage = await optimizeImage(file);
  
  // Create blob URL
  const url = URL.createObjectURL(optimizedImage);
  
  // Store image data
  const image: StoredImage = {
    id: crypto.randomUUID(),
    url,
    originalName: file.name,
    createdAt: new Date().toISOString()
  };

  // Save to localStorage
  const images = getStoredImages();
  images.push(image);
  localStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(images));

  return image;
}

async function optimizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      if (width > MAX_IMAGE_SIZE || height > MAX_IMAGE_SIZE) {
        if (width > height) {
          height = (height / width) * MAX_IMAGE_SIZE;
          width = MAX_IMAGE_SIZE;
        } else {
          width = (width / height) * MAX_IMAGE_SIZE;
          height = MAX_IMAGE_SIZE;
        }
      }

      // Set canvas size and draw image
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to JPEG
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image'));
          }
        },
        'image/jpeg',
        JPEG_QUALITY
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

function getStoredImages(): StoredImage[] {
  const stored = localStorage.getItem(IMAGE_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getImage(id: string): StoredImage | undefined {
  return getStoredImages().find(img => img.id === id);
}