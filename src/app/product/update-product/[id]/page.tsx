"use client"

import Link from 'next/link'
import React, { useEffect, useState, use } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { TailSpin } from 'react-loader-spinner';
import { delete_an_image } from '@/Services/Admin/category';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr'
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { setNavActive } from '@/utils/AdminNavSlice';
import { RootState } from '@/Store/store';
import { get_product_by_id, update_a_product } from '@/Services/Admin/product';
import Cookies from 'js-cookie';
import { storage } from '@/utils/Firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import slugify from 'react-slugify';

type Inputs = {
  _id: string,
  name: string,
  description: string,
  slug: string,
  feature: Boolean,
  price: Number,
  quantity: Number,
  categoryID: string,
  image: any,
  image2: any,
  image3: any,
}

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
  productCategory: string,
  createdAt: string;
  updatedAt: string;
};

type CategoryData = {
  _id: string;
  categoryName: string;
  categoryDescription: string;
  categoryImage: string;
  categorySlug: string;
  selected: string;
  createdAt: string;
  updatedAt: string;
};

interface userData {
  email: String,
  role: String,
  _id: String,
  name: String
}

const uploadImages = async (file: File) => {
  const createFileName = () => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      return `${file?.name}-${timestamp}-${randomString}`;
  }

  const fileName = createFileName();
  const storageRef = ref(storage, `products/${fileName}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
      uploadTask.on('state_changed', (snapshot) => {
      }, (error) => {
          console.log(error)
          reject(error);
      }, () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
          }).catch((error) => {
              console.log(error)
              reject(error);
          });
      });
  });
}


const maxSize = (value: File) => {
  const fileSize = value.size / 1024 / 1024;
  return fileSize < 1 ? false : true
}

export default function Page() {

  const [loader, setLoader] = useState(false)
  const [newError, setNewError] = useState('')
  const Router = useRouter();
  const dispatch = useDispatch();
  const [prodData, setprodData] = useState<ProductData | undefined>(undefined);
  const category = useSelector((state: RootState) => state.Admin.category) as CategoryData[] | undefined
  const useParamObject = useParams<{ id: string }>()
  const id  = useParamObject.id;
  const [productName, setProductName] = useState<any>('')

  useEffect(() => {
    const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');
    if (!Cookies.get('token') || user?.role !== 'admin') {
      Router.push('/')
    }
  }, [Router])

  const productSlug = async  (slugField:/*unresolved*/ any) => {
    setProductName(slugify(slugField))
  }

  const setProductNameValue = async  () => {
      setProductName(productName)
  }

  const { data, isLoading } = useSWR('/gettingProductbyID', () => get_product_by_id(id))
  //if (data?.success !== true) throw new Error (data?.message)

  const currentCategorySelectedItem = data?.data?.productCategory?._id != '' ? data?.data?.productCategory?._id : prodData?.productCategory;

  useEffect(() => {
    setprodData(data?.data)
    setSelected(currentCategorySelectedItem)
  }, [data])

  const options = category?.map((item) => {
    let pushObj = {
      value: item._id,
      key: item._id,
      label: item.categoryName
    }
    return pushObj
  })

  const [selected, setSelected] = useState(currentCategorySelectedItem);

  const onCategorySelect = (event: any) => {
    setSelected(event.target.value)
  }

  const { register, setValue, formState: { errors }, handleSubmit } = useForm<Inputs>({
    criteriaMode: "all"
  });

  const setValueofFormData = () => {
    if (prodData) {
      setValue('name', prodData?.productName)
      setValue('description', prodData?.productDescription)
      setValue('slug', prodData?.productSlug)
      setValue('feature', prodData?.productFeatured)
      setValue('quantity', prodData?.productQuantity)
      setValue('price', prodData?.productPrice)
      setValue('image', prodData?.productImage ? (prodData?.productImage[0] ?? '') : '')
      setValue('image2', prodData?.productImage2 ? (prodData?.productImage2[0] ?? '') : '')
      setValue('image3', prodData?.productImage3 ? (prodData?.productImage3[0] ?? '') : '')
    }
  }

  useEffect(() => {
    if (prodData) {
      setValueofFormData();
    }
  }, [prodData])

  const onSubmit: SubmitHandler<Inputs> = async data => {
    setLoader(false)
    setNewError('')

    const CheckFileSize = maxSize(data.image[0]);
    if (CheckFileSize) {
      setNewError('Image 1 size must be less then 1MB')
      throw new Error('Image size must be less then 1MB')
    } else {
      setNewError('')
    }
    const CheckFileSize2 = maxSize(data.image2[0]);
    if (CheckFileSize2) {
      setNewError('Image 2 size must be less then 1MB')
      throw new Error('Image 2 size must be less then 1MB')
    } else {
      setNewError('')
    }
    const CheckFileSize3 = maxSize(data.image3[0]);
    if (CheckFileSize3) {
      setNewError('Image 3 size must be less then 1MB')
      throw new Error('Image 3 size must be less then 1MB')
    } else {
      setNewError('')
    }

    const uploadImageToFirebase = await uploadImages(data.image[0]);
    const uploadImageToFirebase2 = await uploadImages(data.image2[0]);
    const uploadImageToFirebase3 = await uploadImages(data.image3[0]);

    const updatedData: Inputs = {
      _id: id,
      name: data.name !== prodData?.productName ? data.name : prodData?.productName,
      description: data.description !== prodData?.productDescription ? data.description : prodData?.productDescription,
      slug: slugify(productName),
      feature: data.feature !== prodData?.productFeatured ? data.feature : prodData?.productFeatured,
      quantity: data.quantity !== prodData?.productQuantity ? data.quantity : prodData?.productQuantity,
      price: data.price !== prodData?.productPrice ? data.price : prodData?.productPrice,
      categoryID: data.categoryID !== prodData?.productCategory ? data.categoryID : prodData?.productCategory,
      image: uploadImageToFirebase,
      image2: uploadImageToFirebase2,
      image3: uploadImageToFirebase3,
    };

    const res = '' == newError ? await update_a_product(updatedData) : false
    const imgRes = (prodData?.productImage != undefined && '' != newError) ? await delete_an_image(prodData?.productImage) : false;
    const imgRes2 = (prodData?.productImage2 != undefined && '' != newError) ? await delete_an_image(prodData?.productImage2) : false;
    const imgRes3 = (prodData?.productImage3 != undefined && '' != newError) ? await delete_an_image(prodData?.productImage3) : false;

    if (res?.success && imgRes && imgRes2 && imgRes3) {
      dispatch(setNavActive('Base'))
      setTimeout(() => {
        Router.push("/Dashboard")
      }, 2000);
      setLoader(false)
    } else {
      setLoader(false)
    }
  }

  return (
    <div className="w-full dark:text-black p-4 min-h-screen bg-gray-50 flex flex-col">
      <div className="text-sm breadcrumbs border-b-2 border-b-orange-600">
        <ul>
          <li onClick={() => dispatch(setNavActive('Base'))}>
            <Link href={'/Dashboard'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
              Home
            </Link>
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Update Product
          </li>
        </ul>
      </div>
      <div className="w-full h-20 my-2 text-center">
        <h1 className='text-2xl py-2 '>Update Product</h1>
      </div>
      {
        isLoading || loader ? (
          <div className="w-full flex-col h-96 flex items-center justify-center">
            <TailSpin
              height="50"
              width="50"
              color="orange"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
            <p className="text-sm mt-2 font-semibold text-orange-500">updating product Hold Tight ....</p>
          </div>
        ) : (

          <div className="w-full h-full flex items-start justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg py-2 flex-col ">
              <div className="form-control w-full max-w-full">
                <label className="label">
                  <span className="label-text">Choose Category</span>
                </label>
                <select {...register("categoryID", { required: true })} className="select select-bordered" value={selected} onChange={onCategorySelect}>
                  {
                    options?.map((item) => {
                        return (
                          <option key={item.key} value={item.value}>{item.label} </option>
                        )
                    })
                  }
                </select>
              </div>
              <div className="form-control w-full mb-2">
                <label className="label">
                  <span className="label-text">Product Name</span>
                </label >
                <input {...register("name", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full" onBlur={(e)=>{productSlug(e.currentTarget.value)}} />
                {errors.name && <span className="text-red-500 text-xs mt-2">This field is required</span>}
              </div >
              <div className="form-control w-full mb-2">
                <label className="label">
                  <span className="label-text">Product Slug</span>
                </label>
                <input {...register("slug")} required type="text" placeholder="Type here" className="input input-bordered w-full" onChange={(e)=>{setProductName(e.currentTarget.value)}} />
                {errors.slug && <span className="text-red-500 text-xs mt-2">This field is required</span>}

              </div>
              <div className="form-control w-full mb-2">
                <label className="label">
                  <span className="label-text">Product Price</span>
                </label>
                <input  {...register("price", { required: true })} type="number" placeholder="Type here" className="input input-bordered w-full" />
                {errors.slug && <span className="text-red-500 text-xs mt-2">This field is required</span>}

              </div>
              <div className="form-control w-full mb-2">
                <label className="label">
                  <span className="label-text">Product Quantity</span>
                </label>
                <input  {...register("quantity", { required: true })} type="number" placeholder="Type here" className="input input-bordered w-full" />
                {errors.slug && <span className="text-red-500 text-xs mt-2">This field is required</span>}

              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Product Description</span>
                </label>
                <textarea  {...register("description", { required: true })} className="textarea textarea-bordered h-24" placeholder="Description"></textarea>
                {errors.description && <span className="text-red-500 text-xs mt-2">This field is required</span>}

              </div>
              <div className="form-control py-2">
                <label className="label cursor-pointer">
                  <span className="label-text">Featured Product</span>
                  <input {...register("feature")} type="checkbox" className="checkbox dark:border-black" />
                </label>
              </div>
              {
                prodData && (
                <div className="form-control">
                  <label className="label">
                      <span className="label-text">Main Image</span>
                  </label>

                  <Image src={prodData?.productImage || '/pants.png'} alt='Image Prpduit 1' width={100} height={10} style={{ width: '50', height: '50' }}/>
                  <input {...register("image")} accept="image/*" max="1000000" type="file" className="file-input file-input-bordered w-full" />
                  {errors.image && <span className="text-red-500 text-xs mt-2">This field is required and the image must be less than or equal to 1MB.</span>}
                  <Image src={prodData?.productImage2 || '/pants.png'} alt='Image Prpduit 2' width={100} height={10} style={{ width: '50', height: '50' }}/>
                  <input {...register("image2")} accept="image/*" max="1000000" type="file" className="file-input file-input-bordered w-full" />
                  {errors.image2 && <span className="text-red-500 text-xs mt-2">This field is required and the image must be less than or equal to 1MB.</span>}
                  <Image src={prodData?.productImage3 || '/pants.png'} alt='Image Prpduit 3' width={100} height={10} style={{ width: '50', height: '50' }}/>
                  <input {...register("image3")} accept="image/*" max="1000000" type="file" className="file-input file-input-bordered w-full" />
                  {errors.image3 && <span className="text-red-500 text-xs mt-2">This field is required and the image must be less than or equal to 1MB.</span>}
                  {newError != '' && <span className="text-red-500 text-xs mt-2">Vous devez recharger toutes les images pour mettre à jour le produit</span>}
                </div>
                
                )
              }

              <button className="btn btn-block mt-3">Done !</button>

            </form >
          </div >

        )
      }

    </div >
    
  )
}


