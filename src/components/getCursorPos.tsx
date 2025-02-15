import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const GetCursorPos = ({
    children,
  }: {
    children: (
      xPos: number,
      yPos: number,
      ref: React.MutableRefObject<HTMLImageElement | null>
    ) => React.ReactElement;
  }) => {
    const [pos, setPos] = useState([0, 0]);
    const ref = useRef<HTMLImageElement | null>(null);
  
    const updatePos = (e: MouseEvent) => {
      if (ref.current) {
        const y =
          1 - (ref.current.offsetHeight + ref.current.offsetTop - e.clientY) /
          ref.current.offsetHeight;
        const x =
           1 - (ref.current.offsetWidth + ref.current.offsetLeft - e.clientX) /
          ref.current.offsetWidth;
        setPos([x, y]);
      }
    };
  
    useEffect(() => {
      if (ref.current) {
        ref.current.addEventListener('click', updatePos);
      }
      return () => {
        if (ref.current) {
          ref.current.removeEventListener('click', updatePos);
        }
      };
    });
  
    return children(pos[0], pos[1], ref);
  };


  
  export default function ImageHover({src}:{src: string}) {
    const handleHpImageClik = (dodo: any) => {console.log(dodo)}

    return <GetCursorPos>
        {(x, y, ref) => (
         <img
          src={src}
          alt="no Image"
          ref={ref}
          /*fallbackSrc={whatever}*/
          /*_hover={{
            transform: `scale(1.5)`,
          }}
          /*transformOrigin={`${Math.floor(x * 100)}% ${Math.floor(y * 100)}%`}*/
          /*transition="0.1s linear transform"*/
          /*maxwidth={'min(100%, 650px)'}*/

          /*marginInline={'auto'}
          onLoad={() => setRatio(naturalWidth / naturalHeight)}*/


          sizes="100vw" 
          className="w-full h-full object-fill hidden md:block"
          /*onClick={handleHpImageClik(x + '|' + y)}*/
        />
        )}
    </GetCursorPos>
    }