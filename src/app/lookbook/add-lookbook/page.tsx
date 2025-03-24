"use client"

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/utils/Firebase'
import { ToastContainer } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import { useRouter } from 'next/navigation';
import { add_new_lookbook, delete_a_lookbook, archive_a_lookbook } from '@/Services/Admin/lookbook';
import Cookies from 'js-cookie';
import '../../styles/admin-lookbook.css'
import { get_all_lookbooks } from '@/Services/Admin/lookbook';
import { useSWRConfig } from "swr"

type Inputs = {
    name: string,
    image: Array<File>,
}

const uploadImages = async (file: File, randString : string) => {

    const fileName = `${file?.name}-${randString}`;
    const storageRef = ref(storage, `lookbook/${fileName}`);
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
  
export default function AddLookbook() {

    const [loader, setLoader] = useState(false)
    const [imgsSrc, setImgsSrc] = useState<any>([])
    const Router = useRouter();
    const [countLookbooks, SetCountLookbooks] = useState(0)
    const [archive, SetArchive] = useState(false)
    const [lookbookId, SetLookbookId] = useState('')
    const [lbData, SetLbData] = useState<any>([])
    const { mutate } = useSWRConfig()
    const [badServerResponse, setBadServerResponse] = useState(false)
    
    useEffect(() => {
        FetchDataOFLookbook()
      }, [])

    const FetchDataOFLookbook = async () => {
        const lookbookData = await get_all_lookbooks();
        if (lookbookData?.success !== true) throw new Error (lookbookData?.message)
        SetCountLookbooks(lookbookData?.data?.length)
        if(lookbookData?.data?.length > 0) SetArchive(true)
        SetLbData(lookbookData?.data[0])
        SetLookbookId(Object(lookbookData?.data[0])._id)
      }

    useEffect(() => {
        const user: userData | null = JSON.parse(localStorage.getItem('user') || '{}');
        if (!Cookies.get('token') || user?.role !== 'admin') {
            Router.push('/')
        }
        
    }, [Router])

    const { register, resetField, formState: { errors }, handleSubmit } = useForm<Inputs>({
        criteriaMode: "all"
    });

    const onImgChange = (e: any) => {
      for (const file of e.target.files) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          setImgsSrc((imgs : any) => [...imgs, reader.result]);
        }
        reader.onerror = () => {
          console.log(reader.error)
        }
      }
    }

    const onImgRemove = (e: any) => {
        setImgsSrc([])
        resetField('image')
        e.target.value = null
    }

    const onSubmit: SubmitHandler<Inputs> = async data => {

      
      var fileNames = '';
      setLoader(true)

      for (const myFile of data.image) {
        if(myFile instanceof File){

          const CheckFileSize = maxSize(myFile);
          if (CheckFileSize) throw new Error ('One of your images is too big, image sizes must be less then 1MB')
          
          const timestamp = Date.now();
          const randomString = timestamp + Math.random().toString(36).substring(2, 8);

          const uploadImageToFirebase = await uploadImages(myFile, randomString);
          fileNames += uploadImageToFirebase + ';';
          //console.log(uploadImageToFirebase)
        }
      }

      const finalData = { lookbookName: data.name, lookbookImageUrls: fileNames }

      if (archive) {
        const dateArchived = new Date();
        const createdAt = new Date(lbData.createdAt);
        /* 
        cas où le lookbook doit être archivé puis supprimé 
        */
        const archiveData = { archiveName: lbData.lookbookName, archiveImgUrls: lbData.lookbookImageUrls, archiveLookbookCreatedAt: createdAt, archiveType: 'lookbook', archiveDescription: 'description', archiveImage: 'archiveImage', archiveSlug: 'archiveSlug', archiveDate: dateArchived }

        const archived = await archive_a_lookbook(archiveData)
        if (archived?.success) {
            const deleted = await delete_a_lookbook(lookbookId)
            if(deleted?.success){
                console.log('successe delete')
            }
        } else {
            setLoader(false)
            console.log(archived?.message)
        }
      }
      /* 
      cas où aucun lookbook n'est détecté en base de données et 
      archive vaut false, on procède à la création 
      */
      const res = await add_new_lookbook(finalData)

      if (res.success) {
        mutate('/gettingAllLookbooksFOrAdmin')
        setBadServerResponse(false)
        setTimeout(() => {
            Router.push('/Dashboard')
        }, 2000);
        setLoader(false)
      } else {
        console.log(imgsSrc)
        setBadServerResponse(true)
        setImgsSrc([])
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
                        Add Lookbook
                    </li>
                </ul>
            </div>
            <div className="h-20 my-2 text-center">
                <h1 className="text-2xl py-2 dark:text-black">Add Lookbook</h1>
            </div>
            <div>
                {
                    countLookbooks > 0 ? (
                        <p className="max-w-350 h-17 my-1 text-center py-1 text-red-400">Attention, un lookbook existe déjà. Par conséquent, la création d'un nouveau lookbook va archiver le précédent.</p>
                    ) : (
                        <p className="w-full h-10 my-1 text-center text-2xl py-1 text-grey-400">Ajoutez un titre et un lot d'images. Le titre ne s'affichera pas sur les pages.</p>
                    )

                }
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
                        <p className="text-sm mt-2 font-semibold text-orange-500">Adding Lookbook Hold Tight ....</p>
                    </div>
                ) : (

                    <div className="w-full h-full flex items-start justify-center">
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg  py-2 flex-col" id="add-lookbook">
                            <div className="form-control w-full mb-2">
                                <label className="label">
                                    <span className="label-text">Lookbook Name</span>
                                </label >
                                <input {...register("name", { required: true })} type="text" placeholder="Type here" className="input input-bordered w-full" />
                                {errors.name && <span className="text-red-500 text-xs mt-2">This field is required</span>}
                            </div >

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">Add Lookbook Image</span>
                                </label>
                                <input accept="image/*" max="1000000" {...register("image", { required: true })} onChange={onImgChange} type="file" multiple className="file-input file-input-bordered w-full" />
                                {errors.image && <span className="text-red-500 text-xs mt-2">This field is required and the image must be less than or equal to 1MB.</span>}
                                {imgsSrc && imgsSrc.map((link : any, ky = 0) => (
                                    <div className="overlayContainer" key={ky++}>
                                        <div className="overlay" key={ky++}>
                                            <img src={link} onClick={(e)=>{onImgRemove(e)}} className="overlay" key={ky+++1} />
                                            <div className="close nw_red" onClick={(e)=>{onImgRemove(e)}} key={ky+++2}></div>
                                        </div>
                                    </div>
                                  ))}
                            </div>

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