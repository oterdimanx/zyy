import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Hero() {

  return (
      <div className="hero w-full flex-col md:hidden h-screen flex items-center px-3 justify-center text-center">
        <Image src={'/mob-intro.jpg'} alt="no image" sizes="50vw" fill />
{/** 
        <video preload="auto" width="1280" height="1024" controls>
          <source src="https://ik.imagekit.io/ikmedia/example_video.mp4" type="video/mp4"/>
        </video>
*/}
        <h1 className="mb-2 text-xl text-white/90 z-10 font-semibold">Zyysk8Club Only the strong survive!</h1>
        <Link href={"/#my-Categories"} className="btn btn-ghost border border-orange-600 text-white/90 hover:bg-orange-600 z-40">Shop Now</Link>
      </div>
  )
}
