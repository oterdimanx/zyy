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

    useEffect(() => {
        const userData = localStorage.getItem('user');
        //if (!userData) return;
        if (userData) dispatch(setUserData(JSON.parse(userData)))
        setLoading(false)
      }, [])

    return (

        <>
          <Navbar />
          {
              <>
                <div className="w-full h-full bg-gray-50 px-2">
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