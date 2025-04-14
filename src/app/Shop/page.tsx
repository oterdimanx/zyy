"use client"

import React, { useState , useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Loading from '../loading'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '@/utils/UserDataSlice'
import { RootState } from '@/Store/store'
import LeftColSelectedProducts from '@/components/LeftColSelectedProducts'
import Link from 'next/link'

type ProductData = {
    productName: string,
    productImage: string,
    productSlug: string,
    productPrice: Number,
    productFeatured: Boolean,
    productCategory : {
        categoryName : string,
        categoryDescription  :string ,
        _id : string,
    },
    _id : string
};


export default function Shop() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [categoryId,SetCategoryId] = useState('all')

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    dispatch(setUserData(JSON.parse(userData)));
  }, [])

  const catData = useSelector((state: RootState) => state.Admin.category)
  const catLoading = useSelector((state: RootState) => state.Admin.catLoading)
  var ii = 0
  
  return (
    <>
      <div>
        <Navbar />
      </div>
      {
        catLoading ? <Loading /> :
          <>
            <div className="flex h-full bg-white/95 text-black">
            <div className="border-r-2 border-r-red-900 flex-initial w-[260px]">
              <p className="mt-3 pt-8 pb-1 pl-9 pr-8 flex-initial text-xl uppercase">Categories</p>
              <ul className="pl-9">
                <li className="pt-2"><Link href={"/Dashboard"}>Dashboard</Link></li>
                <li className="pt-2"><Link href={"/Shop"} onClick={()=>SetCategoryId('all')}>ALL</Link></li>
                {
                    <>
                        {
                            catData?.length < 1 ? <h1 className="text-2xl font-semibold text-gray-500">No Categories</h1> :
                            catData?.map((item) => {
                                return <li className="pt-2" key={'li-' + ii++}><Link 
                                    href={"/Shop"}
                                    onClick={()=>{
                                        SetCategoryId(item?._id)

                                    }}
                                    key={ii++}
                                >{item?.categoryName}</Link></li>
                            })
                        }
                    </>
                }
              </ul>
            </div>
            <div className="flex-1">
                <LeftColSelectedProducts categoryId={categoryId} />
            </div>
            </div>

            <Footer />
          </>
      }

    </>
  )
}