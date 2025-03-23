"use Client"

import React, { useEffect, useState } from 'react'
import { useSWRConfig } from "swr"
import { delete_an_archive, delete_an_image } from '@/Services/Admin/archive';
import DataTable from 'react-data-table-component';
import Image from 'next/image';
import Loading from '@/app/loading';
import { useSelector } from 'react-redux';
import { RootState } from '@/Store/store';
import { useRouter } from 'next/navigation';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { storage } from '@/utils/Firebase'
import '../../src/app/styles/admin-archives.css'

type ArchiveData = {
  _id: string;
  archiveName: string;
  archiveImgUrls : string,
  archiveType: string;
  archiveDescription: string;
  archiveImage: string;
  archiveSlug: string;
  archiveDate: string;
  createdAt: string;
  updatedAt: string;
};


export default function ArchiveDataTable() {
  const { mutate } = useSWRConfig()
  const router = useRouter();
  const [archData, setArchData] = useState<ArchiveData[] | []>([]);
  const data = useSelector((state: RootState) => state.Admin.archive)
  const isLoading = useSelector((state: RootState) => state.Admin.archiveLoading);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<ArchiveData[] | []>([]);
  const [imgs, SetImgs] = useState<any[] | []>([]);
  const [fbaseImgPath, setFbaseImgPath] = useState([{}]);

  var ii2 = 0;
  const pendingDeleteArchive = {
    'archId' : '',
  };
  const [arcList, setArcList] = useState(pendingDeleteArchive);

  useEffect(() => {
    setArchData(data)
  }, [data])


  useEffect(() => {
    setFilteredData(data);
    if(undefined !== data) {
      for (var link of data) {
        if(link.archiveType=='lookbook'){
          var imagesArr = link.archiveImgUrls.split(';')
        }
        else{
          var imagesArr = link.archiveImage
        }
      }

      SetImgs(imagesArr)
    }
  }, [data])

  const askToDeleteArchive = async (id: string) => {
    if( '' == arcList.archId) {
      pendingDeleteArchive.archId = id;
      setArcList(pendingDeleteArchive);
    } else {
      setArcList(pendingDeleteArchive);
    }
  }

  const columns = [
    {
      name: 'Name',
      selector: (row: ArchiveData) => row?.archiveName,
      sortable: true,
    },
    {
      name: 'Image',
      cell: (row: ArchiveData) =>  {
        switch(row?.archiveType){
          case 'lookbook': 
            if (row?.archiveImgUrls !== 'null') {
              const tm = row?.archiveImgUrls.split(';')

              for (let index = 0; index < tm.length; index++) {
                ii2++
                const element = tm[index];
                return <img src={element} className="h-12 col mx-auto" key={ii2} />
              }

            }
            break;
          case 'event':
            return <img src={row?.archiveImage} className="h-40 col mx-auto archiveImage" key={ii2++} />
          default:
            break;
          }
      }
      
    },
    {
      name: 'Action',
      cell: (row: ArchiveData) => (
        <div className="flex items-center justify-start px-2 h-20">
          <button onClick={() => router.push(`/archive/update-archive/${row?._id}`)} className="w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700">Update</button>
          {
            arcList?.archId == row?._id ? 
            <button onClick={() => handleDeleteArchive(row?._id, row?.archiveImage, row?.archiveType)} className="w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700">Are you sure ? Click again to confirm</button> : 
            <button onClick={() => askToDeleteArchive(row?._id)} className="w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700">Delete</button>
          }
        </div>
      )
    },
  ];

  const getFileNameFromFbaseItem = (url: string) => {
    var firebasePath = url.split('o/lookbook%2F')[1].split('?')[0]
    return firebasePath;
  }

  const handleDeleteArchive = async (id: string, url: string, type: string) => {

    switch(type){
      case 'lookbook':
        imgs?.map((item: any) => {
          if (item != '') { 
            const imgPath = getFileNameFromFbaseItem(item);
            fbaseImgPath.push(imgPath)
            console.log('ELEM PATH' + imgPath);
          }
        })
      break;

      case 'event':
        if (imgs && imgs[0]?.toString()!='') { 
          console.log(url);
        }

      default:
        break;
    }
    
    console.log('FBIMGPATH' + fbaseImgPath);
    
    const listRef = ref(storage,'lookbook')
    listAll(listRef)
    .then((res) => {
        res.items.forEach((itemRef) => {

          if(fbaseImgPath.includes(itemRef.name)) {
            /** 
             * Si le nom de l'image est contenu dans le tableau du state
             * alors elle doit être effacée
             */

            console.log(itemRef.name);

            deleteObject(itemRef)
            .then(() => [console.log(itemRef.name + ' object has been deleted')])
            .catch((error) => {
                  console.log(error)
            });


          }

        })
    })

    const res = await delete_an_archive(id);

    if (res?.success) {
      const imgRes = await delete_an_image(url);
      //console.log(imgRes?.message)
      //toast.success(res?.message)
      mutate('/gettingAllArchivesFOrAdmin')
    }
    else {
      //toast.error(res?.message)
      throw new Error (res?.message)
    }
  }


  useEffect(() => {
    if (search === '') {
        setFilteredData(archData);
    } else {
        setFilteredData(archData?.filter((item) => {
            const itemData = item?.archiveName.toUpperCase()
            const textData = search.toUpperCase();
            return itemData.indexOf(textData) > -1;
        }))
    }
}, [search, archData])



  return (
    <div className="w-full h-full bg-white">
      <DataTable
        columns={columns}
        data={filteredData || []}
        key={'ThisisArchiveData'}
        pagination
        keyField="id"
        title={`Archives list`} 
        fixedHeader
        fixedHeaderScrollHeight="500px"
        selectableRows
        selectableRowsHighlight
        persistTableHead
        progressPending={isLoading}
        progressComponent={<Loading />}
        subHeader
        subHeaderComponent={
          <input className="w-60 dark:bg-transparent py-2 px-2 outline-none border-b-2 border-orange-600" type={"search"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={"Archive Name"} />
      }
        className="bg-white px-4 h-4/6"
      />

    </div>
  )
}

