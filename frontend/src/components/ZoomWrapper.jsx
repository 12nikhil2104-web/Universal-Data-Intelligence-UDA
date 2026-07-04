import React from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export default function ZoomWrapper({ children }) {
  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={5}
      wheel={{ step: 0.1 }}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <div className="relative h-full w-full">
          {/* Zoom Controls Overlay */}
          <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 hover:opacity-100 transition-opacity">
            <button onClick={() => zoomIn()} className="bg-white px-2 shadow rounded border">+</button>
            <button onClick={() => zoomOut()} className="bg-white px-2 shadow rounded border">-</button>
            <button onClick={() => resetTransform()} className="bg-white px-2 shadow rounded border">Reset</button>
          </div>
          
          <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full">
            {children}
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
}