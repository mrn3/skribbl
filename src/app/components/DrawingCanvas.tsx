"use client";

import { useRef, useState, useEffect } from 'react';

interface DrawingCanvasProps {
  isDrawing: boolean;
  gameState: string;
}

export default function DrawingCanvas({ isDrawing, gameState }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set default canvas styles
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    
    // Fill canvas with white background
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    setCtx(context);

    // Handle window resize
    const handleResize = () => {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      context.putImageData(imageData, 0, 0);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = color;
      context.lineWidth = brushSize;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update brush style when color or size changes
  useEffect(() => {
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
  }, [color, brushSize, ctx]);

  // Clear canvas when game state changes
  useEffect(() => {
    if (!canvasRef.current || !ctx) return;
    if (gameState === 'selecting' || gameState === 'roundEnd') {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [gameState, ctx]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !canvasRef.current) return;
    
    setDrawing(true);
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    setLastPos({ x, y });
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawing || !isDrawing || !ctx || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      
      // Prevent scrolling when drawing
      e.preventDefault();
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // In a real app, here we would emit the drawing data via Socket.io
    // socket.emit('draw', { from: { x: lastPos.x, y: lastPos.y }, to: { x, y }, color, brushSize });
    
    setLastPos({ x, y });
  };

  const endDrawing = () => {
    if (!ctx) return;
    setDrawing(false);
    ctx.closePath();
  };

  // In a real app, we would listen for drawing events from other players
  // and draw them on the canvas

  return (
    <div className="relative w-full h-full max-w-3xl mx-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-full border border-gray-300 rounded-md bg-white cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
      />
      
      {isDrawing && gameState === 'drawing' && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg px-4 py-2 flex space-x-2">
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)} 
            className="w-8 h-8 cursor-pointer"
          />
          
          <div className="flex items-center space-x-1">
            <button 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${brushSize === 2 ? 'bg-gray-200 dark:bg-gray-700' : ''}`} 
              onClick={() => setBrushSize(2)}
            >
              <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
            </button>
            <button 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${brushSize === 5 ? 'bg-gray-200 dark:bg-gray-700' : ''}`} 
              onClick={() => setBrushSize(5)}
            >
              <div className="w-3 h-3 bg-black dark:bg-white rounded-full"></div>
            </button>
            <button 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${brushSize === 10 ? 'bg-gray-200 dark:bg-gray-700' : ''}`} 
              onClick={() => setBrushSize(10)}
            >
              <div className="w-4 h-4 bg-black dark:bg-white rounded-full"></div>
            </button>
            <button 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${brushSize === 15 ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              onClick={() => setBrushSize(15)}
            >
              <div className="w-5 h-5 bg-black dark:bg-white rounded-full"></div>
            </button>
          </div>
          
          <button 
            className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            onClick={() => {
              if (!ctx || !canvasRef.current) return;
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              // In a real app, emit clear canvas event
              // socket.emit('clearCanvas');
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
} 