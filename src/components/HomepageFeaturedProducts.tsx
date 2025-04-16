"use client"

import React from 'react'
import {  useSelector } from 'react-redux'
import { RootState } from '@/Store/store'
import Loading from '@/app/loading'
import Dot from '@/components/Dot'

type ProductData = {
    productName: string,
    productFeatured: Boolean,
    _id : string
};

export default function HomepageFeaturedProducts() {

    const prodData = useSelector((state: RootState) => state.Admin.product);
    const prodLoading = useSelector((state: RootState) => state.Admin.productLoading);
    const FeaturedProducts = prodData?.filter((prod : ProductData) => {
        if(prod?.productFeatured){
            return prod
        }
    })

    const filteredProducts = FeaturedProducts?.slice(0, 4)
    var i = -1
    const coords = [
        [45,35],
        [77,38],
        [29,54],
        [53,77]
    ]

    return (
            prodLoading ? <Loading /> :
                <>
                    {
                        filteredProducts?.length <  1 ? 
                        <h1 className="text-2xl font-semibold text-gray-500">No Featured Products</h1> 
                        :
                        filteredProducts?.map((item: ProductData) => {
                            i++
                            return <Dot
                                    top = {coords[i][0]}
                                    left={coords[i][1]}
                                    _id={item?._id}
                                    label = {item?.productName}
                                    key={item?._id} 
                                    />
                        })
                    }
                </>
        )
}
