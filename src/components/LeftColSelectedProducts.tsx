"use client"

import Loading from '@/app/loading'
import ProductCard from '@/components/ProductCard'
import React, { useEffect, useState } from 'react'
import {  useSelector } from 'react-redux'
import { RootState } from '@/Store/store'

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

export default function LeftColSelectedProducts( props: any ) {

  var ii = 0
  const prodData = useSelector((state: RootState) => state.Admin.product);
  const prodLoading = useSelector((state: RootState) => state.Admin.productLoading)
  const CategoryProducts = prodData?.filter((prod : ProductData) => {
    if(props.categoryId != 'all'){
      if(prod?.productCategory?._id == props.categoryId){
          return prod
      }
    }
    else {
      return prod
    }
  })

  const filteredProducts = CategoryProducts?.slice(0, 9)


  return (
    <>
      <div className="w-full h-screen dark:text-black bg-gray-50 py-4 px-2 font-[Poppin]">
        <div className="w-full h-5/6 flex items-start justify-center flex-wrap overflow-auto">
            {
              prodLoading ? <div className="w-full h-96"><Loading /> </div> :
              <>
              {
                filteredProducts?.map((item: ProductData) => {
                  return <ProductCard
                    productName = {item?.productName}
                    productPrice = {item?.productPrice}
                    productFeatured = {item?.productFeatured}
                    productImage = {item?.productImage}
                    productSlug = {item?.productSlug}
                    productCategory={item?.productCategory}
                    _id={item?._id}
                    key={item?._id + ii++} />
                  })
                }
              </>
            }
            {
              filteredProducts ===  undefined || filteredProducts?.length <  1 && <p className="text-2xl my-4 text-center font-semibold text-red-400">No Product Found in this Category</p>
            }
        </div>
      </div>
    </>
  )
}