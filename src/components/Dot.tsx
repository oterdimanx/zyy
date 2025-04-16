import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DotProps {
  top : number
  left: number
  _id: string
  label: string
}

export default function Dot ({ top, left, _id, label }: DotProps) {
  const router = useRouter()
  const [isHovered,setIsHovered] = useState(false)
  return (
    <div onClick={() => router.push(`/product/product-detail/${_id}`)}><a

      className="absolute w-4 h-4 bg-white rounded-full cursor-pointer animate-blink z-10 hover:bg-gray-300 hover:scale-110 transition-all duration-300"
      style={{ top: `${top}%`, left: `${left}%` }}
      aria-label={label} // Accessibility
      onMouseEnter={() => {setIsHovered(true)}}
      onMouseLeave={() => {setIsHovered(false)}}
    /></div>
  )
}