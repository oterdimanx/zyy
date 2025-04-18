import Link from 'next/link'
import React from 'react'
import { RxDashboard } from 'react-icons/rx'
import { AiFillHome } from 'react-icons/ai'
import { BiCategory } from 'react-icons/bi'
import { BiImages } from 'react-icons/bi'
import { GiLoincloth } from 'react-icons/gi'
import { IoIosAddCircle } from 'react-icons/io'
import { MdOutlinePendingActions } from 'react-icons/md'
import { GrCompliance } from 'react-icons/gr'
import { setNavActive } from '@/utils/AdminNavSlice'
import { useDispatch } from 'react-redux'
import Image from 'next/image'


export default function AdminSidebar() {
    const dispatch =  useDispatch();
    return (
        <div className="w-60 hidden dark:text-black md:block bg-white h-full inline">
            <div className="w-full text-center py-2 px-2 h-20">
                <Image src={'/logo_zyy-02.png'} alt="logo_zyy-02.png" width="250" height="150" sizes="10vw" className="md:block bg-white/95 inline" />
            </div>
            <div className="w-full">
                <ul className="flex px-4 flex-col items-start justify-center">
                    <li onClick={() => dispatch(setNavActive('Base'))} className="py-3 px-1 mb-3"><button className="flex items-center justify-center"> <AiFillHome className="mx-2" />Home</button></li>
                    <li onClick={() => dispatch(setNavActive('activeCategories'))} className="py-3 px-1 mb-3"><button className="flex items-center justify-center"> <BiCategory className="mx-2" />Categories</button></li>
                    <li onClick={() => dispatch(setNavActive('activeProducts'))} className="py-3 px-1 mb-3"><button className="flex items-center justify-center"> <GiLoincloth className="mx-2" />Products</button></li>
                    <li onClick={() => dispatch(setNavActive('activeLookbook'))} className="py-3 px-1 mb-3"><button className="flex items-center justify-center"> <BiImages className="mx-2" />Lookbook</button></li>
                    <li onClick={() => dispatch(setNavActive('activeArchive'))} className="py-3 px-1 mb-3"><button className="flex items-center justify-center"> <BiImages className="mx-2" />Archives</button></li>
                    <li className='py-3 px-1 mb-3'><Link href={'/product/add-product'} className="flex items-center justify-center"> <IoIosAddCircle className="mx-2" />Add Products</Link></li>
                    <li className='py-3 px-1 mb-3'><Link href={'/category/add-category'} className="flex items-center justify-center"> <IoIosAddCircle className="mx-2" />Add Category</Link></li>
                    <li className='py-3 px-1 mb-3'><Link href={'/lookbook/add-lookbook'} className="flex items-center justify-center"> <IoIosAddCircle className="mx-2" />Add Lookbook</Link></li>
                    <li className='py-3 px-1 mb-3'><Link href={'/archive/add-archive'} className="flex items-center justify-center"> <IoIosAddCircle className="mx-2" />Add Archive</Link></li>
                    <li  className='py-3 px-1 mb-3' onClick={() => dispatch(setNavActive('activePendingOrder'))}><button className="flex items-center justify-center"> <MdOutlinePendingActions className="mx-2" />Pending orders</button></li>
                    <li  className='py-3 px-1 mb-3' onClick={() => dispatch(setNavActive('activeDeliveredOrder'))}><button className="flex items-center justify-center"> <GrCompliance className="mx-2" />Completed orders</button></li>
                </ul>
            </div>
        </div>
    )
}