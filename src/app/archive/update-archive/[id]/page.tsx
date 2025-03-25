"use client"

import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import { get_archive_by_id, update_an_archive, delete_an_image } from '@/Services/Admin/archive';
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
    type: string,
}

type ArchiveData = {
    _id: string;
    archiveName: string;
    archiveDescription: string;
    archiveImage: Array<File>;
    archiveSlug: string;
    archiveType: string;
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
    const storageRef = ref(storage, `archives/${fileName}`);
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
    const [badServerResponse, setBadServerResponse] = useState(false)
    const Router = useRouter();
    const dispatch = useDispatch();
    const [arcData, setArcData] = useState<ArchiveData | undefined>(undefined);
    const useParamObject = useParams<{ id: string }>()
    const id = useParamObject.id;

    useEffect(() => {
        const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');
        if (!Cookies.get('token') || user?.role !== 'admin') {
            Router.push('/')
        }
        dispatch(setNavActive('Base'))
    }, [dispatch, Cookies, Router])

    const { data, isLoading } = useSWR('/gettingAllArchivesFOrAdmin', () => get_archive_by_id(id))
    if (data?.success !== true) throw (data?.message)

    useEffect(() => {
        setArcData(data?.data)
    }, [data])

    const [selected, setSelected] = useState(arcData?.archiveType);
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
            setValue('name', arcData?.archiveName ?? '')
            setValue('description', arcData?.archiveDescription ?? '')
            setValue('image', arcData?.archiveImage ? (arcData?.archiveImage[0]?.name ?? '') : '')
            setValue('slug', arcData?.archiveSlug ?? '')
            setValue('type', arcData?.archiveType ?? '')
        },
        [arcData]
    );

    useEffect(() => {
        if (arcData) {
            setValueofFormData();
        }
    }, [arcData]);

    const onSubmit: SubmitHandler<Inputs> = async data => {
        setLoader(false)

        if(undefined != data.image[0]){
            const CheckFileSize = maxSize(data.image[0]);
            if (CheckFileSize) throw new Error ('Image size must be less then 1MB')
        }

        const uploadImageToFirebase = (undefined != data.image[0]) ? await uploadImages(data.image[0]) : arcData?.archiveImage;

        const updatedData: Inputs = {
            _id: id,
            name: data.name !== arcData?.archiveName ? data.name : arcData?.archiveName,
            description: data.description !== arcData?.archiveDescription ? data.description : arcData?.archiveDescription,
            slug: data.slug !== arcData?.archiveSlug ? slugify(data.slug) : arcData?.archiveSlug,
            type: data.type !== arcData?.archiveType ? data.type.toString() : arcData?.archiveType.toString(),
            image: uploadImageToFirebase,
        };

        const mainImageFilename = arcData?.archiveImage.toString() ?? '';
        const imgRes = 'object' === typeof(data.image[0]) && arcData?.archiveImage != undefined ? await delete_an_image(mainImageFilename) : true

        const res = await update_an_archive(updatedData)

        if (res?.success && imgRes) {
            setBadServerResponse(false)
            dispatch(setNavActive('Base'))
            setTimeout(() => {
                Router.push("/Dashboard")
            }, 2000);
            setLoader(false)
        } else {
            setBadServerResponse(true)
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
                        Update Archive
                    </li>
                </ul>
            </div>
            <div className="w-full h-20 my-2 text-center">
                <h1 className="text-2xl py-2">Update Archive</h1>
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
                        <p className="text-sm mt-2 font-semibold text-orange-500">updating Archive Hold Tight ....</p>
                    </div>
                ) : (

                    <div className="w-full h-full flex items-start justify-center">
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg py-2 flex-col">
                            <div className="form-control w-full mb-2">
                                <label className="label">
                                    <span className="label-text">Archive Name</span>
                                </label >
                                <input    {...register("name")} type="text" placeholder="Type here" className="input input-bordered w-full" />
                                {errors.name && <span className="text-red-500 text-xs mt-2">This field is required</span>}
                            </div >
                            <div className="form-control w-full mb-2">
                                <label className="label">
                                    <span className="label-text">Archive Slug</span>
                                </label>
                                <input  {...register("slug")} type="text" placeholder="Type here" className="input input-bordered w-full" />
                                {errors.slug && <span className="text-red-500 text-xs mt-2">This field is required</span>}

                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Archive Description</span>
                                </label>
                                <textarea  {...register("description")} className="textarea textarea-bordered h-24" placeholder="Description"></textarea>
                                {errors.description && <span className="text-red-500 text-xs mt-2">This field is required</span>}

                            </div>

                            <div className="form-control w-full max-w-full">
                                <label className="label">
                                    <span className="label-text">Type d'archive</span>
                                </label>
                                <select multiple={true} {...register("type", { required: true })} className="select select-bordered" value={selected} onChange={(e) => onCategorySizesSelect(e,setSelected,)}>
                                    <option key="disabled" disabled>Choisir un type</option>
                                    <option key="event" value="event">"Evènement"</option>
                                    <option key="lookbook" value="lookbook">"Lookbook"</option>
                                </select>
                                {errors.type && <span className="text-red-500 text-xs mt-2">Ce champ est requis: merci de sélectionner un type d'archive.</span>}
                            </div>
                            {
                                arcData && arcData?.archiveType == 'event' && arcData?.archiveImage != undefined && (

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Modifier l'image</span>
                                        </label>
                                        <Image src={arcData?.archiveImage.toString() || '/pants.png'} alt='No Image Found' width={200} height={200} style={{ width: '200', height: '200' }} />
                                        <input accept="image/*" max="1000000"  {...register("image", { required: false })} type="file" className="file-input file-input-bordered w-full" />
                                        {errors.image && <span className="text-red-500 text-xs mt-2">This field is required and the image must be less than or equal to 1MB.</span>}
                                    </div>
                                )
                            }
                            {
                                badServerResponse && (
                                    <div className="form-control">
                                        <span className="text-red-500 text-lg mt-2">
                                            Une erreur innatendue est survenue. 
                                            Merci de tenter de vous reconnecter pour procéder.
                                        </span>
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


