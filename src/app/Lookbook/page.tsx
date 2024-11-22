"use client"

import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { useForm, SubmitHandler } from "react-hook-form";
import { TailSpin } from 'react-loader-spinner'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/Store/store'
import CartCard from '@/components/CartCard'
import {  get_all_cart_Items } from '@/Services/common/cart'
import { setCart } from '@/utils/CartSlice'
import { setNavActive } from '@/utils/AdminNavSlice'
import { create_a_new_order } from '@/Services/common/order'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'


import { setUserData } from '@/utils/UserDataSlice'

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
                    <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
                        <ul className="dark:text-black">
                            <li>
                                <Link href={"/"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                Lookbook
                            </li>
                        </ul>
                    </div>
                    <div className="w-full h-20 my-2 text-center">
                        <h1 className="text-2xl py-2 dark:text-black">Lookbook</h1>
                    </div>

                </div>
                <Footer />
              </>
          }



        </>
    )

}