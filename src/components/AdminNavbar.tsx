"use client"

import { setNavActive} from '@/utils/AdminNavSlice'
import Cookies from 'js-cookie'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useDispatch } from 'react-redux'

export default function AdminNavbar() {
    const router =  useRouter();
    const dispatch =  useDispatch();


    const handleLogout = () => {
        Cookies.remove('token');
        localStorage.clear();
        location.reload();
    }

    return (
        <div className="navbar dark:text-black bg-white">
            <div className="flex-1">
                <div className="dropdown md:hidden">
                    <label tabIndex={0} className="btn btn-active btn-circle bg-white/95">
                        <Image src={'/logo_zyy-02.png'} alt="logo_zyy-02.png" width="250" height="150" sizes="10vw" className="md:block bg-white/95" />
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow text-black bg-gray-50 rounded-box w-52">
                        <li onClick={() => dispatch(setNavActive('Base'))}><button>Homepage</button></li>
                        <li onClick={() => dispatch(setNavActive('activeCategories'))}><button>Categories</button></li>
                        <li onClick={() => dispatch(setNavActive('activeProducts'))}><button>Products</button></li>
                        <li onClick={() => dispatch(setNavActive('activeLookbook'))}><button>Lookbook</button></li>
                        <li onClick={() => dispatch(setNavActive('activeArchive'))}><button>Archives</button></li>
                        <li><Link href={"/product/add-product"}>Add Products</Link></li>
                        <li><Link href={"/category/add-category"}>Add Category</Link></li>
                        <li><Link href={"/lookbook/add-lookbook"}>Add Lookbook</Link></li>
                        <li><Link href={"/archive/add-archive"}>Add Archive</Link></li>
                        <li onClick={() => dispatch(setNavActive('activePendingOrder'))}><button>Pending orders</button></li>
                        <li onClick={() => dispatch(setNavActive('activeDeliveredOrder'))}><button>Completed orders</button></li>
                    </ul>
                </div>
            </div>
            <div className="flex-none">
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 relative rounded-full">
                            <Image className='rounded-full' alt='none' src="/profile.jpg" sizes='50vw' height="150" width="150"/>
                        </div>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-gray-50 rounded-box w-52">
                        <li>
                            <Link href={"/Dashboard"} className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </Link>
                        </li>
                        <li onClick={handleLogout}><button> Logout </button></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
