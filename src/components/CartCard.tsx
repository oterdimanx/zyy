"use client"


import { delete_a_cart_item, get_all_cart_Items } from '@/Services/common/cart'
import { RootState } from '@/Store/store'
import { setCart } from '@/utils/CartSlice'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { AiFillDelete } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'

type Data = {
    productID: {
        productName: string,
        productPrice: String,
        _id: string,
        productImage: string,
        productQuantity: number,
    }
    userID: {
        email: string,
        _id: string,
    },
    _id: string,
    quantity : number,
}

interface userData {
    email: String,
    role: String,
    _id: String,
    name: String
}


export default function CartCard({ productID, userID, _id , quantity }: Data) {
    const dispatch = useDispatch();
    const [qnt, setQnt] = useState(quantity)
    const Router = useRouter();
    const user = useSelector((state: RootState) => state.User.userData) as userData | null
    const cart = useSelector((state: RootState) => state.Cart.cart) as Data[] | null
    const [errorMsg, SetErrorMsg] = useState('')

    const handleDeleteCartItem = async () => {
        const res = await delete_a_cart_item(_id)
        if (res?.success) {
            fetchCartData();
            console.log(res?.message)
        }
        SetErrorMsg(res?.message)
    }


    const fetchCartData = async () => {
        if (!user?._id) return Router.push('/')
        const cartData = await get_all_cart_Items(user?._id)
        if (cartData?.success) {
            dispatch(setCart(cartData?.data))
        } else {
            SetErrorMsg(cartData?.message)
        }
    }


    const handleIncrement = () => {
        const newCart = cart?.map((item: Data) => {
            if (item?._id === _id) {
                if (item?.productID?.productQuantity > item?.quantity) {
                    return {
                        ...item,
                        quantity: Number(item?.quantity) + 1,
                    }
                }else{
                    SetErrorMsg('Product Quantity is not available')
                    return {
                        ...item,
                        quantity: Number(item?.productID?.productQuantity),
                    }
                }
            }
            return item
        })
        if (qnt > 0) {
            let quantity = qnt + 1
            setQnt(quantity)
            dispatch(setCart(newCart))
        }
        else {
            setQnt(quantity)
            dispatch(setCart(newCart))
        }
    }


    const handleDecrement = () => {
        SetErrorMsg('')
        const newCart = cart?.map((item: Data) => {
            if (item._id === _id) {
                if (item?.quantity > 1) {
                    return {
                        ...item,
                        quantity: Number(item.quantity) - 1,
                    }
                }
            }
            return item
        })
        if (qnt > 1) {
            let quantity = qnt - 1
            setQnt(quantity)
            dispatch(setCart(newCart))
        }
        else {
            setQnt(quantity)
            dispatch(setCart(newCart))
        }
    }

    return (
        <div className="bg-white w-10/12 rounded-xl m-2 border-b flex-col md:flex-row h-72  md:h-40 py-2 px-4 flex justify-around items-center">
            <Image src={productID?.productImage || '/pants.png'} alt="no image found" width={100} height={150} className="rounded" />
            <h3 className="font-semibold text-lg">Rs {productID?.productPrice}</h3>
            <div className="flex  justify-center items-center">
                <button onClick={handleIncrement} className="btn btn-circle dark:text-white  text-xl">+</button>
                <p className="mx-2 text-xl">{quantity}</p>
                <button onClick={handleDecrement} className="btn btn-circle dark:text-white  text-xl">-</button>
            </div>
            <span className="text-red-500 text-xs mt-2">{errorMsg}</span>
            <AiFillDelete onClick={handleDeleteCartItem} className="text-red-500 text-2xl cursor-pointer " />
        </div>
    )
}
