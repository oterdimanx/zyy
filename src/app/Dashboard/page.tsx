"use client"
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import SuperComponent from '@/components/SuperComponent';
import { ToastContainer } from 'react-toastify';
import useSWR from 'swr'
import { useDispatch } from 'react-redux';
import { setCatLoading, setCategoryData, setOrderData, setProdLoading, setProductData, setLookbookLoading, setLookbookData } from '@/utils/AdminSlice';
import Loading from '../loading';
import { setNavActive } from '@/utils/AdminNavSlice';
import { get_all_products } from '@/Services/Admin/product';
import { get_all_orders } from '@/Services/Admin/order';
import { get_all_categories } from '@/Services/Admin/category';
import { get_all_lookbooks } from '@/Services/Admin/lookbook';

interface userData {
  email: String,
  role: String,
  _id: String,
  name: String
}

export default function Dashboard() {
  const Router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');
    if (!Cookies.get('token') || user?.role !== 'admin' || user?.email !== 'olivier@terdiman.fr') {
      Router.push('/')
    }
    dispatch(setNavActive('Base'))
  }, [dispatch, Cookies, Router])

  const { data: categoryData, isLoading: categoryLoading } = useSWR('/gettingAllCategoriesFOrAdmin', get_all_categories)
  //if (categoryData?.success !== true) throw new Error (categoryData?.message)
  const { data: productData, isLoading: productLoading } = useSWR('/gettingAllProductsFOrAdmin', get_all_products)
  //if (productData?.success !== true) throw new Error (productData?.message)
  const {data : orderData, isLoading : orderLoading} = useSWR('/gettingAllOrdersForAdmin', get_all_orders)
  //if (orderData?.success !== true) throw new Error (orderData?.message)
  const { data: lookbookData, isLoading: lookbookLoading } = useSWR('/gettingAllLookbooksFOrAdmin', get_all_lookbooks)

  console.log(lookbookData?.data)
  useEffect(() => {
    dispatch(setCategoryData(categoryData?.data))
    dispatch(setCatLoading(categoryLoading))
    dispatch(setProductData(productData?.data))
    dispatch(setProdLoading(productLoading))
    dispatch(setOrderData(orderData?.data))
    dispatch(setCatLoading(orderLoading))
    dispatch(setLookbookData(lookbookData?.data))
    dispatch(setLookbookLoading(lookbookLoading))
  }, [categoryData, dispatch, categoryLoading, productData, productLoading , orderData , orderLoading])

  return (
    <div className="w-full h-screen flex bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <div className="w-full h-full">
        <AdminNavbar />
        <div className="w-full h-5/6 flex flex-wrap items-start justify-center overflow-y-auto  px-4 py-2">
          {categoryLoading || productLoading || lookbookLoading ? <Loading /> : <SuperComponent />}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

