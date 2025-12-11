import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, RotateCw, ZoomIn, ZoomOut, Move, Check } from 'lucide-react';
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

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImage(img);
      const initialScale = Math.min(targetWidth / img.width, targetHeight / img.height);
      setScale(initialScale);
      setPosition({
        x: 0,
        y: 0,
      });
    };
    img.src = URL.createObjectURL(imageFile);

    return () => {
      URL.revokeObjectURL(img.src);
    };
  }, [imageFile, aspectRatio, targetWidth, targetHeight]);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    ctx.save();

    const centerX = targetWidth / 2;
    const centerY = targetHeight / 2;

    ctx.translate(centerX + position.x, centerY + position.y);
    ctx.rotate((rotation * Math.PI) / 180);

    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;

    ctx.drawImage(
      image,
      -scaledWidth / 2,
      -scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );

    ctx.restore();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(1, 1, targetWidth - 2, targetHeight - 2);
    ctx.setLineDash([]);
  }, [image, scale, rotation, position, targetWidth, targetHeight]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.nativeEvent.offsetX - position.x,
      y: e.nativeEvent.offsetY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.nativeEvent.offsetX - dragStart.x,
      y: e.nativeEvent.offsetY - dragStart.y,
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
    const initialScale = Math.min(targetWidth / image.width, targetHeight / image.height);
    setScale(initialScale);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleSave = async () => {
    if (!canvasRef.current || !image) return;

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = targetWidth;
    outputCanvas.height = targetHeight;
    const ctx = outputCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    ctx.save();

    const centerX = targetWidth / 2;
    const centerY = targetHeight / 2;

    ctx.translate(centerX + position.x, centerY + position.y);
    ctx.rotate((rotation * Math.PI) / 180);

    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;

    ctx.drawImage(
      image,
      -scaledWidth / 2,
      -scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );

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
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col"
      >
        <div className="p-4 flex-shrink-0 border-b border-white/10">
          <div className="flex items-center justify-between">
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
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex justify-center bg-gray-950 rounded-xl p-4">
              <canvas
                ref={canvasRef}
                className="border-2 border-white/20 rounded-lg cursor-move"
                style={{
                  width: `${Math.min(targetWidth, 700)}px`,
                  height: `${Math.min(targetHeight, targetHeight * (700 / targetWidth))}px`,
                  maxWidth: '100%',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4 justify-center">
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

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <Move className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-200">
                  <span className="font-semibold">Instructies:</span> Sleep de afbeelding • Gebruik zoom knoppen • Roteer met roteer knop • Bijgesneden naar {targetWidth}×{targetHeight}px
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex-shrink-0 border-t border-white/10 bg-gray-900">
          <div className="flex gap-3 max-w-4xl mx-auto">
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
