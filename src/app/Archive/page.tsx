"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import { setUserData } from '@/utils/UserDataSlice'
//import Lookbook from '@/components/Lookbook'
import Loading from '@/app/loading';

export default function Page() {

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    const [ratio, setRatio] = useState(16/9)

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) return;
        dispatch(setUserData(JSON.parse(userData)));
        setLoading(false)
      }, [])

    return (

        <>
          <Navbar />
          <Hero setRatio={setRatio} />
          {
              <>
                <div className="w-full h-full bg-gray-50 px-2">
                    <div className="text-sm breadcrumbs border-b-2 border-b-orange-600">
                        <ul className="dark:text-black">
                            <li>
                                <Link href={"/"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                Archive
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h1 className="text-2xl py-2 dark:text-black">Archive</h1>
                        
                        {
                            loading ? <Loading /> :
                            <>
                                coucou
                            </>
                        }
                    </div>
                </div>
                <Footer />
              </>
          }
        </>
    )

}