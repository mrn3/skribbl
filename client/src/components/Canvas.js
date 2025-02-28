import React, { useEffect, useRef, useState } from 'react';
import './Canvas.css';

function Canvas({ isDrawing, sendDrawData, socket }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Set default styles
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    
    // Clear canvas on new turn
    if (!isDrawing) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    // Handle incoming draw data
    if (socket && !isDrawing) {
      socket.on('draw-data', (data) => {
        const { x0, y0, x1, y1, color, brushSize, type } = data;
        
        context.beginPath();
        
        if (type === 'start') {
          context.moveTo(x0, y0);
          context.lineTo(x1, y1);
        } else if (type === 'draw') {
          context.moveTo(x0, y0);
          context.lineTo(x1, y1);
        }
        
        context.strokeStyle = color;
        context.lineWidth = brushSize;
        context.stroke();
        context.closePath();
      });
    }
    
    return () => {
      if (socket) {
        socket.off('draw-data');
      }
    };
  }, [isDrawing, socket, color, brushSize]);
  
  const startDrawing = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    context.beginPath();
    context.moveTo(x, y);
    setDrawing(true);
    
    sendDrawData({
      x0: x,
      y0: y,
      x1: x,
      y1: y,
      color,
      brushSize,
      type: 'start'
    });
  };
  
  const draw = (e) => {
    if (!isDrawing || !drawing) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    context.lineTo(x, y);
    context.stroke();
    
    sendDrawData({
      x0: context.lastX || x,
      y0: context.lastY || y,
      x1: x,
      y1: y,
      color,
      brushSize,
      type: 'draw'
    });
    
    context.lastX = x;
    context.lastY = y;
  };
  
  const stopDrawing = () => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    context.closePath();
    setDrawing(false);
    context.lastX = undefined;
    context.lastY = undefined;
  };
  
  const clearCanvas = () => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Send clear command to other clients
    sendDrawData({ type: 'clear' });
  };

  return (
    <div className="canvas-wrapper">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        className={isDrawing ? 'drawing' : ''}
      />
      
      {isDrawing && (
        <div className="drawing-tools">
          <div className="color-picker">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          
          <div className="brush-size">
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
            />
          </div>
          
          <button onClick={clearCanvas}>Clear</button>
        </div>
      )}
    </div>
  );
}

export default Canvas; 