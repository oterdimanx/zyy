"use Client"

import React, { useEffect, useState } from 'react'
import { useSWRConfig } from "swr"
import { delete_a_lookbook } from '@/Services/Admin/lookbook';
import DataTable from 'react-data-table-component';
import Loading from '@/app/loading';
import { useSelector } from 'react-redux';
import { RootState } from '@/Store/store';
import { useRouter } from 'next/navigation';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { storage } from '@/utils/Firebase'

type LookbookData = {
  _id: string;
  lookbookName: string;
  lookbookImageUrls: string;
  createdAt: string;
  updatedAt: string;
};


export default function LookbookDataTable() {
  const { mutate } = useSWRConfig()
  const router = useRouter();
  const [lookData, setLookData] = useState<LookbookData[] | []>([]);
  const data = useSelector((state: RootState) => state.Admin.lookbook)
  const isLoading = useSelector((state: RootState) => state.Admin.lookbookLoading);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<LookbookData[] | []>([]);
  const [count, setCount] = useState(0);
  const [imgs, SetImgs] = useState<LookbookData[] | []>([]);
  const [fbaseImgPath, setFbaseImgPath] = useState([{}]);

  var ii2 = count;
  var i = count;

  const pendingDeleteLookbook = {
    'lbookId' : '',
    'count' : count,
  };
  const [lookbookList, setLookbookList] = useState(pendingDeleteLookbook);

  useEffect(() => {
    setLookData(data)
  }, [data])

  useEffect(() => {
    setFilteredData(lookData);
    if(undefined !== lookData) {
      for (var link of lookData) {
        var imagesArr = Object(link).lookbookImageUrls.split(';')
      }
      SetImgs(imagesArr);
    }
  }, [ lookData])

  const askToDeleteLookbook = async (id: string) => {
    if( '' == lookbookList.lbookId) {
      i++
      pendingDeleteLookbook.count = i;
      pendingDeleteLookbook.lbookId = id;
      setCount(i)
      setLookbookList(pendingDeleteLookbook);
    }else if('' != lookbookList.lbookId) {
      i++
      pendingDeleteLookbook.count = i;
      setCount(i)
      setLookbookList(pendingDeleteLookbook);
    }
  }

  const columns = [
    {
      name: 'Name',
      selector: (row: LookbookData) => row?.lookbookName,
      sortable: true,
    },
    {
      name: 'Images',
      cell: (row: LookbookData) => (
        <div className="flex items-center justify-start px-2 max-h-1px max-w-xs">

          {
            imgs?.map((item: any) => {
                ii2++
                if (item != '') return <img src={item} className="h-12 mx-auto" key={ii2} />
            })
          } 

        </div>
      )
    },
    {
      name: 'Action',
      cell: (row: LookbookData) => (
        <div className="flex items-center justify-start px-2 h-20">
          <button onClick={() => router.push(`/lookbook/update-lookbook/${row?._id}`)} className="w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700">Update</button>

          {
            count > 0 && lookbookList?.lbookId == row?._id ? 
            <button onClick={() => handleDeleteLookbook(row?._id)} className="w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700">Are you sure ? Click again to confirm</button> : 
            <button onClick={() => askToDeleteLookbook(row?._id)} className="w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700">Delete</button>
          }
          
          <button onClick={() => router.push(`/lookbook/add-lookbook`)} className="w-20 py-2 mx-2 text-xs text-blue-600 hover:text-white my-2 hover:bg-blue-600 border border-blue-600 rounded transition-all duration-700">Archiver</button>
        </div>
      )
    },
  ];

  const getFileNameFromFbaseItem = (url: string) => {
    var firebasePath = url.split('o/lookbook%2F')[1].split('?')[0]
    return firebasePath;
  }

  const handleDeleteLookbook = async (id: string) => {

    imgs?.map((item: any) => {
      if (item != '') { 

        const imgPath = getFileNameFromFbaseItem(item);
        fbaseImgPath.push(imgPath)

      }
    })
    
    const listRef = ref(storage,'lookbook')
    listAll(listRef)
    .then((res) => {
        res.items.forEach((itemRef) => {

          if(fbaseImgPath.includes(itemRef.name)) {
            /** 
             * Si le nom de l'image est contenu dans le tableau du state
             * alors elle doit être effacée
             */
            deleteObject(itemRef)
            .then(() => [console.log(itemRef.name + ' object has been deleted')])
            .catch((error) => {
                  console.log(error)
            });
          }

        })
    })

    const res = await delete_a_lookbook(id);
  
    if (res?.success) {
      mutate('/gettingAllLookbooksFOrAdmin')
    }
    else {
      throw new Error (res?.message)
    }

  }

  useEffect(() => {
    if (search === '') {
        setFilteredData(lookData);
    } else {
        setFilteredData(lookData?.filter((item) => {
            const itemData = item?.lookbookName.toUpperCase()
            const textData = search.toUpperCase();
            return itemData.indexOf(textData) > -1;
        }))
    }
}, [search, lookData])

  return (
    <div className="w-full h-full bg-white">
      <DataTable
        columns={columns}
        data={filteredData || []}
        key={'ThisisLookbookData'}
        pagination
        keyField="id"
        title={`Lookbook`} 
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
              placeholder={"Lookbook Name"} />
      }
        className="bg-white px-4 h-4/6"
      />

    </div>
  )
}

