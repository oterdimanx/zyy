"use client"

import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import { get_category_by_id, update_a_category, delete_an_image } from '@/Services/Admin/category';
import { useRouter, useParams } from 'next/navigation';
import useSWR from 'swr'
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setNavActive } from '@/utils/AdminNavSlice';
import Cookies from 'js-cookie';
import { storage } from '@/utils/Firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import slugify from 'react-slugify';

type Inputs = {
    _id: string,
    name: string,
    description: string,
    slug: string,
    image: any,
    sizes: string,
}

type CategoryData = {
    _id: string;
    categoryName: string;
    categoryDescription: string;
    categoryImage: Array<File>;
    categorySlug: string;
    categorySizes: string;
    createdAt: string;
    updatedAt: string;
};

interface pageParam {
    id: string
}

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
    const storageRef = ref(storage, `categories/${fileName}`);
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
    const Router = useRouter();
    const dispatch = useDispatch();
    const [catData, setCatData] = useState<CategoryData | undefined>(undefined);
    const useParamObject = useParams<{ id: string }>()
    const id = useParamObject.id;

    useEffect(() => {
        const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');
        if (!Cookies.get('token') || user?.role !== 'admin') {
            Router.push('/')
        }
        dispatch(setNavActive('Base'))
    }, [dispatch, Cookies, Router])

    const { data, isLoading } = useSWR('/gettingAllCategoriesFOrAdmin', () => get_category_by_id(id))
    if (data?.success !== true) throw (data?.message)

    useEffect(() => {
        setCatData(data?.data)
    }, [data])

    const [selected, setSelected] = useState(catData?.categorySizes);
    const onCategorySizesSelect = (event: any, setSelected: /*unresolved*/any) => {
        const options = [...event.target.selectedOptions]
        const values = options.map( option => option.value )
        setSelected(values)
    }

    const { register, setValue, formState: { errors }, handleSubmit } = useForm<Inputs>({
        criteriaMode: "all"
    });

    const setValueofFormData = useCallback(
        () => {
            setValue('name', catData?.categoryName ?? '')
            setValue('description', catData?.categoryDescription ?? '')
            setValue('image', catData?.categoryImage ? (catData?.categoryImage[0]?.name ?? '') : '')
            setValue('slug', catData?.categorySlug ?? '')
            setValue('sizes', catData?.categorySizes ?? '')
        },
        [catData]
    );

    useEffect(() => {
        if (catData) {
            setValueofFormData();
        }
    }, [catData]);

    const onSubmit: SubmitHandler<Inputs> = async data => {
        setLoader(false)

        const CheckFileSize = maxSize(data.image[0]);
        if (CheckFileSize) throw new Error ('Image size must be less then 1MB')
        const uploadImageToFirebase = await uploadImages(data.image[0]);

        const updatedData: Inputs = {
            _id: id,
            name: data.name !== catData?.categoryName ? data.name : catData?.categoryName,
            description: data.description !== catData?.categoryDescription ? data.description : catData?.categoryDescription,
            slug: data.slug !== catData?.categorySlug ? slugify(data.slug) : catData?.categorySlug,
            sizes: data.sizes !== catData?.categorySizes ? data.sizes.toString() : catData?.categorySizes.toString(),
            image: uploadImageToFirebase,
        };

        const mainImageFilename = catData?.categoryImage.toString() ?? '';
        const imgRes = (catData?.categoryImage != undefined) ? await delete_an_image(mainImageFilename) : false;
        const res = await update_a_category(updatedData)

        if (res?.success && imgRes) {
            //toast.success(res?.message);
            //console.log(catData?.categoryImage[0]?.name)
            dispatch(setNavActive('Base'))
            setTimeout(() => {
                Router.push("/Dashboard")
            }, 2000);
            setLoader(false)
        } else {
            //toast.error(res?.message)
            setLoader(false)
        }
    }

    return (
        <div className="w-full dark:text-black p-4 min-h-screen  bg-gray-50 flex flex-col">
            <div className="text-sm breadcrumbs  border-b-2 border-b-orange-600">
                <ul>
                    <li onClick={() => dispatch(setNavActive('Base'))}>
                        <Link href={'/Dashboard'}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                            Home
                        </Link>
                    </li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Update Category
                    </li>
                </ul>
            </div>
            <div className="w-full h-20 my-2 text-center">
                <h1 className="text-2xl py-2">Update Category</h1>
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
                        <p className="text-sm mt-2 font-semibold text-orange-500">updating Category Hold Tight ....</p>
                    </div>
                ) : (

                    <div className="w-full h-full flex items-start justify-center">
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg py-2 flex-col">
                            <div className="form-control w-full mb-2">
                                <label className="label">
                                    <span className="label-text">Category Name</span>
                                </label >
                                <input {...register("name")} type="text" placeholder="Type here" className="input input-bordered w-full" />
                                {errors.name && <span className="text-red-500 text-xs mt-2">This field is required</span>}
                            </div >
                            <div className="form-control w-full mb-2">
                                <label className="label">
                                    <span className="label-text">Category Slug</span>
                                </label>
                                <input {...register("slug")} type="text" placeholder="Type here" className="input input-bordered w-full" />
                                {errors.slug && <span className="text-red-500 text-xs mt-2">This field is required</span>}

                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Category Description</span>
                                </label>
                                <textarea {...register("description")} className="textarea textarea-bordered h-24" placeholder="Description"></textarea>
                                {errors.description && <span className="text-red-500 text-xs mt-2">This field is required</span>}

                            </div>

                            <div className="form-control w-full max-w-full">
                                <label className="label">
                                    <span className="label-text">Choose Sizes</span>
                                </label>
                                <select multiple={true} {...register("sizes", { required: true })} className="select select-bordered" value={selected} onChange={(e) => onCategorySizesSelect(e,setSelected,)}>
                                    <option disabled>Pick sizes</option>
                                    <option key="unique" value="unique">"unique"</option>
                                    <option key="s" value="s">"s"</option>
                                    <option key="m" value="m">"m"</option>
                                    <option key="l" value="l">"l"</option>
                                    <option key="xl" value="xl">"xl"</option>
                                </select>
                            </div>
                            {
                                catData  && catData?.categoryImage != undefined && (

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Old Image</span>
                                        </label>
                                        <Image src={catData?.categoryImage.toString() || '/pants.png'} alt='No Image Found' width={200} height={200} style={{ width: '200', height: '200' }} />
                                        <input accept="image/*" max="1000000"  {...register("image", { required: true })} type="file" className="file-input file-input-bordered w-full" />
                                        {errors.image && <span className="text-red-500 text-xs mt-2">This field is required and the image must be less than or equal to 1MB.</span>}
                                    </div>
                                )
                            }
                            <button className="btn btn-block mt-3">Done !</button>

                        </form >
                    </div >

                )
            }

            <ToastContainer />
        </div >
    )
}


