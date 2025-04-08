"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { RootState } from '@/Store/store';
import { useSelector } from 'react-redux';
import { FaCartArrowDown } from 'react-icons/fa';
import { CiDeliveryTruck } from 'react-icons/ci'
import { MdFavorite } from 'react-icons/md';
import Image from 'next/image'

export default function Navbar() {
    const router = useRouter()
    const [Scrolled, setScrolled] = useState(false);
    const user =  useSelector((state : RootState) => state.User.userData)

    useEffect(() => {
        window.onscroll = () => {
            setScrolled(window.pageYOffset < 30 ? false : true)
            return () => window.onscroll = null
        }
    }, [Scrolled])

    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.clear();
        location.reload();
    }

    return (
        <div className={`navbar ${Scrolled ? "bg-white/95  " : "bg-white/95"} mainNav flex top-0 left-0 border-b-2 border-b-red-900 pb-0 pt-0`}>
            <div className="border-r-2 border-r-red-900 flex-none">
                <div className="dropdown">
                    <label className="text-white">
                        <Image src={'/logo_zyy-02.png'} alt="logo_zyy-02.png" width="250" height="250" sizes="30vw" className="md:block" onClick={() => router.push("/")} />
                    </label>
                </div>
            </div>
            <div className="secondaryNav bg-white-50 px-2 py-2">
                <ul className="">
                    <li>
                        <div className="text-sm m-w-full overflow-x-auto text-black">
                            <ul className="dark:text-black text-red-400 text-xl flex subpixel-antialiased">
                                <li className="p-auto">
                                    <Link href={"/Lookbook"}>Lookbook</Link>
                                </li>
                                <li className="pl-10">
                                    <Link href={"/Archive"}>Archives</Link>
                                </li>  
                                <li className="pl-10 whitespace-nowrap">
                                    <Link href={"/Shop"}>Shop ALL</Link>
                                </li>                                
                            </ul>
                        </div>
                    </li>
                    <li>
                        <div className="text-sm m-w-full overflow-x-auto text-black pt-10">
                            <ul className="dark:text-black">
                            <li className="inline-block mt-30 pr-10">
                                <Link href={'/'}>
                                ZYY FALL 24
                                </Link>
                            </li>
                            <li className="inline-block text-2xl">|</li>
                            <li className="inline-block">
                                <p className="relative left-[26%]">
                                    ZYY CLASSICS
                                </p>
                            </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="navbar-end m-auto m-width-100">
                <div className="flex-none">
                    {
                        user ?
                        <div className="flex items-center justify-center  min-h-full">
                         <button onClick={handleLogout} className="btn text-white mx-2">logout</button>
                         <button onClick={() => router.push("/order/create-order")} className="btn btn-circle mx-2"><FaCartArrowDown className="text-white text-xl" /></button>
                         <button onClick={() => router.push("/bookmark")} className="btn btn-circle mx-2"><MdFavorite className="text-white text-xl" /></button>
                         <button onClick={() => router.push("/order/view-orders")} className="btn btn-circle mx-2"><CiDeliveryTruck className="text-white text-xl" /></button>
                         
                        </div>
                            :
                            <button onClick={() => router.push('/auth/login')} className="btn text-white mx-2">Login</button>
                    }
                </div>
            </div>
        </div>
    )
}
