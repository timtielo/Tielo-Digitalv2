import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, RotateCw, ZoomIn, ZoomOut, Move, Crop, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface ImageEditorProps {
  imageFile: File;
  aspectRatio: '4:3' | '16:9';
  onSave: (blob: Blob) => void;
  onCancel: () => void;
}

export function ImageEditor({ imageFile, aspectRatio, onSave, onCancel }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const targetWidth = 800;
  const targetHeight = aspectRatio === '4:3' ? 600 : 450;
  const displayWidth = 800;
  const displayHeight = aspectRatio === '4:3' ? 600 : 450;

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImage(img);
      const scaleX = displayWidth / img.width;
      const scaleY = displayHeight / img.height;
      setScale(Math.max(scaleX, scaleY));
      setPosition({
        x: (displayWidth - img.width * Math.max(scaleX, scaleY)) / 2,
        y: (displayHeight - img.height * Math.max(scaleX, scaleY)) / 2,
      });
    };
    img.src = URL.createObjectURL(imageFile);

    return () => {
      URL.revokeObjectURL(img.src);
    };
  }, [imageFile, aspectRatio]);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = displayWidth;
    canvas.height = displayHeight;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, displayWidth, displayHeight);

    ctx.save();
    ctx.translate(displayWidth / 2, displayHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-displayWidth / 2, -displayHeight / 2);
    ctx.drawImage(image, position.x / scale, position.y / scale);
    ctx.restore();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, displayWidth, displayHeight);
  }, [image, scale, rotation, position]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.1));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    if (!image) return;
    const scaleX = displayWidth / image.width;
    const scaleY = displayHeight / image.height;
    setScale(Math.max(scaleX, scaleY));
    setRotation(0);
    setPosition({
      x: (displayWidth - image.width * Math.max(scaleX, scaleY)) / 2,
      y: (displayHeight - image.height * Math.max(scaleX, scaleY)) / 2,
    });
  };

  const handleSave = async () => {
    if (!canvasRef.current || !image) return;

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = targetWidth;
    outputCanvas.height = targetHeight;
    const ctx = outputCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    ctx.save();
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);
    ctx.translate(-targetWidth / 2, -targetHeight / 2);
    ctx.drawImage(image, position.x / scale, position.y / scale);
    ctx.restore();

    outputCanvas.toBlob((blob) => {
      if (blob) {
        onSave(blob);
      }
    }, 'image/jpeg', 0.92);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-gray-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Afbeelding Bewerken</h2>
              <p className="text-sm text-gray-400">
                Doel formaat: {targetWidth} × {targetHeight}px ({aspectRatio})
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6 flex justify-center bg-gray-950 rounded-xl p-4">
            <canvas
              ref={canvasRef}
              className="max-w-full cursor-move border-2 border-white/20 rounded-lg"
              style={{
                maxHeight: '500px',
                width: `${displayWidth}px`,
                height: `${displayHeight}px`,
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              variant="outline"
              onClick={handleZoomIn}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <ZoomIn className="h-4 w-4 mr-2" />
              Zoom In
            </Button>
            <Button
              variant="outline"
              onClick={handleZoomOut}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <ZoomOut className="h-4 w-4 mr-2" />
              Zoom Out
            </Button>
            <Button
              variant="outline"
              onClick={handleRotate}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <RotateCw className="h-4 w-4 mr-2" />
              Roteren
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              Reset
            </Button>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Move className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-200">
                <p className="font-semibold mb-1">Hoe te gebruiken:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-300">
                  <li>Sleep de afbeelding om te verplaatsen</li>
                  <li>Gebruik zoom knoppen om in/uit te zoomen</li>
                  <li>Roteer de afbeelding met de roteer knop</li>
                  <li>De afbeelding wordt automatisch bijgesneden naar {targetWidth}×{targetHeight}px</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 border-0"
            >
              <Check className="h-5 w-5 mr-2" />
              Opslaan
            </Button>
            <Button
              variant="outline"
              onClick={onCancel}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              Annuleren
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
