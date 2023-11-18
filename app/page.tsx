"use client"

import React, { FC, useState, useEffect } from 'react';
import { useDraw } from '../hooks/useDraw';
import { ChromePicker } from 'react-color';

interface PageProps {}

interface Point {
  x: number;
  y: number;
}

const Page: FC<PageProps> = () => {
  const [color, setColor] = useState<string>('#000');
  const [currentShape, setCurrentShape] = useState<string>('line');
  const [lineWidth, setLineWidth] = useState<number>(5);

  const { canvasRef, onMouseDown, clear } = useDraw(draw);

  useEffect(() => {
    clearCanvas();
  }, [currentShape]);

  const erase = () => {
    setColor('#fff'); 
  };

  const clearCanvas = () => {
    clear();
    erase();
  };

  function draw({ prevPoint, currentPoint, ctx }: Draw) {
    const lineColor = color;

    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;

    if (currentShape === 'line') {
      if (prevPoint) {
        drawLine(prevPoint, currentPoint, ctx);
      }
    } else if (currentShape === 'rectangle') {
      drawRectangle(prevPoint, currentPoint, ctx);
    } else if (currentShape === 'circle') {
      drawCircle(prevPoint, currentPoint, ctx);
    }

    ctx.stroke();
  }

  const drawLine = (startPoint: Point, endPoint: Point, ctx: CanvasRenderingContext2D) => {
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
  };

  const drawRectangle = (startPoint: Point | null, endPoint: Point | null, ctx: CanvasRenderingContext2D) => {
    if (startPoint && endPoint) {
      const width = endPoint.x - startPoint.x;
      const height = endPoint.y - startPoint.y;
      ctx.rect(startPoint.x, startPoint.y, width, height);
    }
  };

  const drawCircle = (startPoint: Point | null, endPoint: Point | null, ctx: CanvasRenderingContext2D) => {
    if (startPoint && endPoint) {
      const radius = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
      ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
    }
  };

  return (
    <div className='w-screen h-screen bg-white flex justify-center items-center'>
      <div className='flex flex-col gap-10 pr-10'>
        <div className='flex flex-col border border-black rounded-md p-7'>
          <p>Change Width of Pen</p>
      <input
            type='range'
            min={1}
            max={20}
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className='p-2 rounded-md border border-black'
          />
          </div>
        <ChromePicker color={color} onChange={(e) => setColor(e.hex)} />
        <div className='flex flex-col gap-2'>
          <button type='button' className='p-2 rounded-md border border-black' onClick={clearCanvas}>
            Clear canvas
          </button>
          <div className='p-2 rounded-md border border-black'>
            <select
              value={currentShape}
              onChange={(e) => {
                setCurrentShape(e.target.value);
                clearCanvas();
              }}
            >
              <option value='line'>Line</option>
              <option value='rectangle'>Rectangle</option>
              <option value='circle'>Circle</option>
            </select>
          </div>
 
          <button type='button' className='p-2 rounded-md border border-black' onClick={erase}>
            Erase
          </button>
        </div>
      </div>
      <canvas ref={canvasRef} onMouseDown={onMouseDown} width={550} height={550} id='canvas' className='border border-black rounded-md' />
    </div>
  );
};

export default Page;
