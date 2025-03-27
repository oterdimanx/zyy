"use Client"

import React, { useEffect, useState } from 'react'

import { useSWRConfig } from "swr"
//import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import Image from 'next/image';
import Loading from '@/app/loading';
import { useSelector } from 'react-redux';
import { RootState } from '@/Store/store';
import { useRouter } from 'next/navigation';
import { delete_a_product } from '@/Services/Admin/product';
import { delete_an_image } from '@/Services/Admin/category';


type ProductData = {
  _id: string,
  productName: string,
  productDescription: string,
  productImage: string,
  productImage2: string,
  productImage3: string,
  productSlug: string,
  productPrice: Number,
  productQuantity: Number,
  productFeatured: Boolean,
  productCategory: {
    _id: string,
    categoryName: string,
    categorySlug: string
  },
  createdAt: string;
  updatedAt: string;
};


export default function ProductDataTable() {
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const [prodData, setprodData] = useState<ProductData[] | []>([])
  const data = useSelector((state: RootState) => state.Admin.product)
  const isLoading = useSelector((state: RootState) => state.Admin.productLoading)
  const [search, setSearch] = useState('')
  const [filteredData, setFilteredData] = useState<ProductData[] | []>([])
  const pendingDeleteProduct = {
    'prod' : '',
    'myImgs' : [],
  }
  const [prodList, setProdList] = useState(pendingDeleteProduct);

  useEffect(() => {
    setprodData(data)
  }, [data])

  useEffect(() => {
    setFilteredData(prodData)
  }, [prodData])

  const askToDeleteProduct = async (id: string, arr: any) => {
    if( '' == prodList.prod) {
      pendingDeleteProduct.prod = id
      pendingDeleteProduct.myImgs = arr
      setProdList(pendingDeleteProduct)
    } else{
      setProdList({
        'prod' : '',
        'myImgs' : [],
      })
    }
  }

  const columns = [
    {
      name: 'Name',
      selector: (row: ProductData) => row?.productName,
      sortable: true,
    },
    {
      name: 'Category',
      selector: (row: ProductData) => row?.productCategory?.categoryName,
      sortable: true,
    },
    {
      name: 'Image',
      cell: (row: ProductData) => <Image src={row?.productImage || '/pants.png'} alt="No Image Found" className="py-2" width={100} height={100} style={{ width: 'auto', height: 'auto' }}/>
    },
    {
      name: 'Action',
      cell: (row: ProductData) => (
        <div className="flex items-center justify-start px-2 h-20">
          <button onClick={() => router.push(`/product/update-product/${row?._id}`)} className="w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700">Update</button>
          {
            prodList?.prod == row?._id ? 
            <button onClick={() => handleDeleteProduct(row?._id, prodList?.myImgs)} className="w-40 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700">Are you sure ? Click again to confirm</button> : 
            <button onClick={() => askToDeleteProduct(row?._id, [row?.productImage,row?.productImage2,row?.productImage3])} className="w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700">Delete</button>
          }
        </div>
      )
    },

  ];

  const handleDeleteProduct = async (id: string, urls: any) => {
    const res = await delete_a_product(id);
    if (res?.success) {
      for (let index = 0; index < urls.length; index++) {
        const url = urls[index];
        const imgRes = await delete_an_image(url);
        if (imgRes?.success) {
          console.log('image supprimée : ' + url)
        }
      }
      mutate('/gettingAllProductsFOrAdmin')
    }
    else {
      throw new Error (res?.message)
    }
    setProdList({
      'prod' : '',
      'myImgs' : [],
    })
  }

  useEffect(() => {
    if (search === '') {
      setFilteredData(prodData);
    } else {
      setFilteredData(prodData?.filter((item) => {
        const itemData = item?.productCategory?.categoryName.toUpperCase();
        const textData = search.toUpperCase();
        return itemData.indexOf(textData) > -1;
      }))
    }
  }, [search, prodData])

  return (
    <div className='w-full h-full'>
      <DataTable
        columns={columns}
        data={filteredData || []}
        key={'ThisProductData'}
        pagination
        keyField="id"
        title={`Products list`}
        fixedHeader
        fixedHeaderScrollHeight='500px'
        selectableRows
        selectableRowsHighlight
        persistTableHead
        progressPending={isLoading}
        progressComponent={<Loading />}
        subHeader
        subHeaderComponent={
          <input className='w-60 dark:bg-transparent py-2 px-2 outline-none  border-b-2 border-orange-600' type={"search"}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={"Product Name"} />
        }
        className="bg-white px-4 h-4/6"
      />

    </div>
  )
}

