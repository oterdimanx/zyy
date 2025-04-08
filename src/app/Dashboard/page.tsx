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
import { setCatLoading, setCategoryData, setOrderData, setProdLoading, setProductData, setLookbookLoading, setLookbookData, setArchiveLoading, setArchiveData } from '@/utils/AdminSlice';
import Loading from '../loading';
import { setNavActive } from '@/utils/AdminNavSlice';
import { get_all_products } from '@/Services/Admin/product';
import { get_all_orders } from '@/Services/Admin/order';
import { get_all_categories } from '@/Services/Admin/category';
import { get_all_lookbooks } from '@/Services/Admin/lookbook';
import { get_all_archives } from '@/Services/Admin/archive';

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
      if (undefined === Cookies.get('token')) {
        Cookies.remove('token');
        localStorage.clear();
        Router.push('/auth/login?token=expired')
      }
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
  const { data: archiveData, isLoading: archiveLoading } = useSWR('/gettingAllArchivesFOrAdmin', get_all_archives)

  useEffect(() => {
    dispatch(setCategoryData(categoryData?.data))
    dispatch(setCatLoading(categoryLoading))
    dispatch(setProductData(productData?.data))
    dispatch(setProdLoading(productLoading))
    dispatch(setOrderData(orderData?.data))
    dispatch(setCatLoading(orderLoading))
    dispatch(setLookbookData(lookbookData?.data))
    dispatch(setLookbookLoading(lookbookLoading))
    dispatch(setArchiveData(archiveData?.data))
    dispatch(setArchiveLoading(archiveLoading))
  }, [categoryData, dispatch, categoryLoading, productData, productLoading , orderData , orderLoading, lookbookData, lookbookLoading, archiveData, archiveLoading ])

  return (
    <div className="w-full h-screen flex bg-gray-50 overflow-hidden font-[Poppin]">
      <AdminSidebar />
      <div className="w-full h-full font-[Poppin]">
        <AdminNavbar />
        <div className="w-full h-5/6 flex flex-wrap items-start justify-center overflow-y-auto font-[Poppin] px-4 py-2">
          {categoryLoading || productLoading || lookbookLoading || archiveLoading ? <Loading /> : <SuperComponent />}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

