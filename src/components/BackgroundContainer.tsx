import React, { useEffect, useRef } from 'react';
import { debounce } from 'lodash'

interface BackgroundContainerProps {
  imageUrl: string;
  children?: React.ReactNode;
}

export default function BackgroundContainer({ imageUrl, children }: BackgroundContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = debounce(() => {
      const container = containerRef.current;
      if (container) {
        container.style.backgroundSize = 'cover';
        container.style.backgroundPosition = 'center'; // Recenter background
      }
    }, 300); // 300ms delay after resize stops

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel(); // Clean up debounce
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen bg-cover bg-center bg-no-repeat relative overflow-hidden background-container"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      {children}
    </div>
  );
}