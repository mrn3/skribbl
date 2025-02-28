'use client';

import { useEffect, useState, useRef, RefObject } from 'react';

interface DrawingCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  isDrawing: boolean;
  onDraw: (drawData: any) => void;
  onClearCanvas: () => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  canvasRef,
  isDrawing,
  onDraw,
  onClearCanvas,
}) => {
  const [isDrawingActive, setIsDrawingActive] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  // Colors for the color picker
  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#00ffff', '#ff00ff', '#c0c0c0', '#808080',
    '#800000', '#808000', '#008000', '#800080', '#008080', '#000080',
  ];
  
  // Brush sizes
  const brushSizes = [2, 5, 10, 15, 20];
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || !canvasContainerRef.current) return;
    
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    
    // Set canvas size to match container
    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      // Set default canvas background to white
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };
    
    resizeCanvas();
    
    // Resize canvas when window resizes
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [canvasRef]);
  
  // Handle mouse events for drawing
  useEffect(() => {
    if (!canvasRef.current || !isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    const handleMouseDown = (e: MouseEvent) => {
      setIsDrawingActive(true);
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setLastX(x);
      setLastY(y);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawingActive) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Draw line
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      // Send drawing data to server
      onDraw({
        type: 'line',
        x0: lastX,
        y0: lastY,
        x1: x,
        y1: y,
        color,
        size: brushSize,
      });
      
      setLastX(x);
      setLastY(y);
    };
    
    const handleMouseUp = () => {
      setIsDrawingActive(false);
    };
    
    const handleMouseLeave = () => {
      setIsDrawingActive(false);
    };
    
    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      setIsDrawingActive(true);
      setLastX(x);
      setLastY(y);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      
      if (!isDrawingActive) return;
      
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      // Draw line
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.stroke();
      
      // Send drawing data to server
      onDraw({
        type: 'line',
        x0: lastX,
        y0: lastY,
        x1: x,
        y1: y,
        color,
        size: brushSize,
      });
      
      setLastX(x);
      setLastY(y);
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      setIsDrawingActive(false);
    };
    
    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      // Remove event listeners
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canvasRef, isDrawing, isDrawingActive, color, brushSize, lastX, lastY, onDraw]);
  
  // Handle clear canvas
  const handleClear = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      onClearCanvas();
    }
  };
  
  return (
    <div className="flex flex-col items-center w-full max-w-3xl">
      {/* Drawing tools - only visible for the drawer */}
      {isDrawing && (
        <div className="drawing-tools">
          {/* Color picker */}
          <div className="flex flex-wrap justify-center gap-1 mb-2">
            {colors.map((c) => (
              <button
                key={c}
                className={`w-6 h-6 rounded-full ${color === c ? 'ring-2 ring-blue-500' : ''}`}
                style={{ backgroundColor: c, border: c === '#ffffff' ? '1px solid #ccc' : 'none' }}
                onClick={() => setColor(c)}
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
          
          {/* Brush size picker */}
          <div className="flex items-center gap-2 ml-4">
            {brushSizes.map((size) => (
              <button
                key={size}
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  brushSize === size ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                onClick={() => setBrushSize(size)}
                aria-label={`Brush size ${size}`}
              >
                <div
                  className="rounded-full bg-black dark:bg-white"
                  style={{ width: `${size}px`, height: `${size}px` }}
                />
              </button>
            ))}
          </div>
          
          {/* Clear canvas button */}
          <button
            className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      )}
      
      {/* Canvas container */}
      <div
        ref={canvasContainerRef}
        className={`w-full border-2 ${
          isDrawing ? 'border-blue-500 cursor-crosshair' : 'border-gray-300 cursor-default'
        } rounded-lg overflow-hidden relative`}
        style={{ height: '400px' }}
      >
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
        
        {/* Overlay for non-drawers */}
        {!isDrawing && (
          <div className="absolute top-2 left-2 bg-gray-800 bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
            Waiting for drawer...
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawingCanvas; 