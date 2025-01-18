import { v4 as uuidv4 } from 'uuid';

interface StoredImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  createdAt: string;
}

const IMAGES_KEY = 'tielo_digital_images';

export function getAllImages(): StoredImage[] {
  const imagesJson = localStorage.getItem(IMAGES_KEY);
  return imagesJson ? JSON.parse(imagesJson) : [];
}

export function saveImage(file: File): Promise<StoredImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const image: StoredImage = {
          id: uuidv4(),
          url: reader.result as string,
          alt: '',
          width: img.width,
          height: img.height,
          createdAt: new Date().toISOString()
        };

        const images = getAllImages();
        images.push(image);
        localStorage.setItem(IMAGES_KEY, JSON.stringify(images));
        
        resolve(image);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = reader.result as string;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}