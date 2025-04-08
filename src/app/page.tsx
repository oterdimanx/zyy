"use client"
import React, { useState , useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Loading from './loading'
import { get_all_categories } from '@/Services/Admin/category'
import { get_all_products } from '@/Services/Admin/product'
import { setCategoryData, setCatLoading, setProdLoading, setProductData, setLookbookData, setLookbookLoading } from '@/utils/AdminSlice'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '@/utils/UserDataSlice'
import { RootState } from '@/Store/store'
import FeaturedProduct from '@/components/FeaturedProduct'
import TopCategories from '@/components/TopCategories'

export default function Home() {
  const dispatch = useDispatch();
  const categoryLoading = useSelector((state: RootState) => state.Admin.catLoading)
  const productLoading = useSelector((state: RootState) => state.Admin.productLoading)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    dispatch(setUserData(JSON.parse(userData)));
  }, [])

  useEffect(() => {
    FetchDataOFProductAndCategory()
  }, [])

  const FetchDataOFProductAndCategory = async () => {

    const categoryData = await get_all_categories();
    if (categoryData?.success !== true) throw new Error (categoryData?.message)

    dispatch(setCategoryData(categoryData?.data))

    const productData = await get_all_products();
    if (productData?.success !== true) throw new Error (productData?.message)

    dispatch(setProductData(productData?.data))

    setLoading(false)
  }

  useEffect(() => {
    dispatch(setCatLoading(loading))
    dispatch(setProdLoading(loading))
  }, [categoryLoading, productLoading, dispatch, loading])

  return (
    <>
      <div className="grid">
        <Navbar />
        <Hero />
      </div>
      {
        loading ? <Loading /> :
          <>
            <TopCategories />
            <FeaturedProduct />
            <Footer />
          </>
      }

    </>
  )
}