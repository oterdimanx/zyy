"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/utils/Firebase'
import { ToastContainer } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import { useRouter } from 'next/navigation';
import { add_new_archive } from '@/Services/Admin/archive';
import Cookies from 'js-cookie';
import DatePicker from 'react-date-picker';
import slugify from 'react-slugify';
import '../../styles/admin-lookbook.css'
import "../../styles/react-date-picker/dist/DatePicker.css";
import '../../styles/admin-archives.css'

type Inputs = {
    name: string,
    lbImgUrls: string,
    lbCreatedAt: Date,
    type: string,
    description: string,
    image: Array<File>,
    slug: string,
    date: Date,
}

interface loaderType {
    loader: Boolean
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

interface userData {
    email: String,
    role: String,
    _id: String,
    name: String
}

export default function AddArchive() {

    const [archiveName, setArchiveName] = useState<any>('')
    const [loader, setLoader] = useState(false)
    const [startDateValue, setStartDateValue] = useState(new Date());
    const [dateValue, setDateValue] = useState(startDateValue);
    const Router = useRouter();

    const onChangeDate = (date: any) => {
        setDateValue(() => date);
    }

    const archiveSlug = async  (slugField:/*unresolved*/ any) => {
        setArchiveName(slugify(slugField))
    }
    
    const setArchiveNameValue = async  () => {
        setArchiveName(slugify(archiveName))
    }

    useEffect(() => {
        const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');
        if (!Cookies.get('token') || user?.role !== 'admin') {
            Router.push('/')
        }
        
    }, [  Router])


    const { register, formState: { errors }, handleSubmit } = useForm<Inputs>({
        criteriaMode: "all"
    });

    const onSubmit: SubmitHandler<Inputs> = async data => {
        setLoader(true)
        const CheckFileSize = maxSize(data.image[0]);
        if (CheckFileSize) throw new Error ('Image size must be less then 1MB')
        const uploadImageToFirebase = await uploadImages(data.image[0]);

        const finalData = { archiveName: data.name, archiveImgUrls: 'null', archiveDescription: data.description, archiveImage: uploadImageToFirebase, archiveSlug: data.slug, archiveType: 'event', archiveDate: dateValue }

        const res = await add_new_archive(finalData)
        if (res.success) {
            setTimeout(() => {
                Router.push('/Dashboard')
            }, 2000);
            setLoader(false)
        } else {
            setLoader(false)
            throw new Error (res?.message)
        }

    }

    return (
        <div className="w-full p-4 min-h-screen bg-gray-50 flex flex-col">
            <div className="text-sm breadcrumbs border-b-2 border-b-orange-600">
                <ul className="dark:text-black">
                    <li>
                        <Link href={'/Dashboard'}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                            Home
                        </Link>
                    </li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 mr-2 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Add Archive
                    </li>
                </ul>
            </div>
            <div className="w-full h-20 my-2 text-center">
                <h1 className="text-2xl py-2 dark:text-black">Add Archive</h1>
            </div>
            {
                loader ? (
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
                        <p className="text-sm mt-2 font-semibold text-orange-500">Adding Archive Hold Tight ....</p>
                    </div>
                ) : (

                    <div className="w-full h-full flex items-start justify-center">
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg  py-2 flex-col">
                            <div className="form-control w-full mb-2">
                                <label className="label">
                                    <span className="label-text">Archive Name</span>
                                </label >
                                <input required type="text" placeholder="Type here" className="input input-bordered w-full" onBlur={(e)=>{archiveSlug(e.currentTarget.value)}} onChange={setArchiveNameValue} />
                                {errors.name && <span className="text-red-500 text-xs mt-2">This field is required</span>}
                            </div >
                            <div className="form-control w-full mb-2">
                                <label className="label">
                                    <span className="label-text">Archive Slug</span>
                                </label>
                                <input required type="text" placeholder="Type here" className="input input-bordered w-full" onBlur={(e)=>{e.currentTarget.value = slugify(e.currentTarget.value)}} value={archiveName} onChange={(e)=>{setArchiveName(e.currentTarget.value)}} />
                                {errors.slug && <span className="text-red-500 text-xs mt-2">This field is required</span>}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Archive Description</span>
                                </label>
                                <textarea  {...register("description", { required: true })} className="textarea textarea-bordered h-24" placeholder="Description"></textarea>
                                {errors.description && <span className="text-red-500 text-xs mt-2">This field is required</span>}
                            </div>
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Add Archive Image</span>
                                </label>
                                <input accept="image/*" max="1000000"  {...register("image", { required: true })} type="file" className="file-input file-input-bordered w-full " />
                                {errors.image && <span className="text-red-500 text-xs mt-2">This field is required and the image must be less than or equal to 1MB.</span>}
                            </div>
                            <div className="form-control max-w-full h-<200> block sticky">
                                <label className="label">
                                    <span className="label-text">Choose Date Event Archive</span>
                                </label>
                                <DatePicker className="d-flex flex-column w-<800> datepicker"
                                            onChange={(dateValue)=>{onChangeDate(dateValue)}}
                                            format="dd/MM/yyyy h:mm"
                                            minDate={dateValue}
                                            closeCalendar={false}
                                            
                                        />
                                {
                                    startDateValue < dateValue && (
                                        <pre><span className="label-text">Date prévue :</span>{dateValue.toLocaleString()}</pre>

                                    )
                                }
                            </div>
                            <div className="max-w-full h-<200> inline-block relative">
                                &nbsp;
                            </div>
                            <button className="btn btn-block mt-3 m-auto relative">Done !</button>
                        </form >
                    </div >
                )
            }

            <ToastContainer />
        </div >
    )
}