import React, { useEffect, useState } from 'react'
import { RootState } from '@/Store/store'
import { useDispatch, useSelector } from 'react-redux'
import { setLookbookData, setLookbookLoading } from '@/utils/AdminSlice'
import Loading from '@/app/loading';
import { get_all_lookbooks } from '@/Services/Admin/lookbook';

/*
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '@/utils/Firebase'
*/

export default function Lookbook() {

    //const [storedImages, setStoredImages] = useState([])
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    const [filteredDatas, setFilteredDatas] = useState([])
    const lookbookData = useSelector((state: RootState) => state.Admin.lookbook)
    const lookbookLoading = useSelector((state: RootState) => state.Admin.lookbookLoading)
    var ii2 = 0
    var urls = []
    var kii = 'lbook-';

    useEffect(() => {
        FetchDataOFLookbook()
      }, [])

    const FetchDataOFLookbook = async () => {
        const lookbookData = await get_all_lookbooks();
        if (lookbookData?.success !== true) throw new Error (lookbookData?.message)
        setFilteredDatas(lookbookData?.data)
        dispatch(setLookbookData(lookbookData?.data))
        setLoading(false)
      }
    
      useEffect(() => {
        dispatch(setLookbookLoading(loading))
      }, [lookbookLoading, dispatch, loading])

/*
    const renderedValues = []

    useEffect(() => {
        getStoredImages()
      }, [])

    const getStoredImages = async () => {
        const listRef = ref(storage,'lookbook')
        var lookBook:any = []
        var ii = 0
        listAll(listRef)
        .then((res) => {
            res.items.forEach((itemRef) => {
                getDownloadURL(itemRef).then((downloadURL) => {
                    if(!lookBook.includes(downloadURL)){
                        lookBook[ii] = downloadURL
                        ii++;
                        setStoredImages(lookBook)
                    }
                }).catch((error) => {
                    console.log(error)
                    lookBook = []
                    return lookBook
                });
            })
        })
        return lookBook
    }
*/

    for (var link of filteredDatas) {
        urls.push(Object(link).lookbookImageUrls.split(';'))
    }

    urls = urls[0]?.filter((elem: string) => '' !== elem)

    return (
        <div className="grid container">
            <div>
                <div className="lookbook-container grid grid-flow-col">
                    <div className="md:p-20" key="leftcol-lbook"></div>
                    <div className="max-w-full mx-auto">
                        {
                            lookbookLoading ? <div className="w-full h-96"><Loading /> </div> :
                            <>
                                {
                                    lookbookData?.length < 1 ? <h1 className="text-2xl font-semibold text-gray-500">No Lookbook Found</h1> :
                                    urls?.map((item: any) => {
                                        ii2++
                                        return <img src={item} className="h-auto mx-auto" key={kii + ii2} />
                                    })
                                }
                            </>
                        }
                    </div>
                    <div className="" key="rightcol-lbook"></div>
                </div>
            </div>
        </div>
    )
}