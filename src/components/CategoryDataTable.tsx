"use Client"

import React, { useEffect, useState } from 'react'
import { useSWRConfig } from "swr"
//import { toast } from 'react-toastify';
import { delete_a_category, delete_an_image } from '@/Services/Admin/category';
import DataTable from 'react-data-table-component';
import Image from 'next/image';
import Loading from '@/app/loading';
import { useSelector } from 'react-redux';
import { RootState } from '@/Store/store';
import { useRouter } from 'next/navigation';
import { cp } from 'fs';
import { any } from 'joi';

type CategoryData = {
  _id: string;
  categoryName: string;
  categoryDescription: string;
  categoryImage: string;
  categorySlug: string;
  createdAt: string;
  updatedAt: string;
};


export default function CategoryDataTable() {
  const { mutate } = useSWRConfig()
  const router = useRouter();
  const [catData, setCatData] = useState<CategoryData[] | []>([]);
  const data = useSelector((state: RootState) => state.Admin.category)
  const isLoading = useSelector((state: RootState) => state.Admin.catLoading);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState<CategoryData[] | []>([]);
  const [count, setCount] = useState(0);
  var i = count;
  const pendingDeleteCategory = {
    'cat' : '',
    'count' : count,
  };
  const [catList, setCatList] = useState(pendingDeleteCategory);

  useEffect(() => {
    setCatData(data)
  }, [data])


  useEffect(() => {
    setFilteredData(catData);
  }, [ catData])

  const askToDeleteCategory = async (id: string) => {
    if( '' == catList.cat) {
      i++
      pendingDeleteCategory.count = i;
      pendingDeleteCategory.cat = id;
      setCount(i)
      setCatList(pendingDeleteCategory);
    }
  }

  const columns = [
    {
      name: 'Name',
      selector: (row: CategoryData) => row?.categoryName,
      sortable: true,
    },
    {
      name: 'Image',
      cell: (row: CategoryData) => <Image src={row?.categoryImage || "/pants.png"} alt="No Image Found" className="py-2" width={100} height={100} style={{ width: 'auto', height: 'auto' }} />
    },
    {
      name: 'Action',
      cell: (row: CategoryData) => (
        <div className="flex items-center justify-start px-2 h-20">
          <button onClick={() => router.push(`/category/update-category/${row?._id}`)} className="w-20 py-2 mx-2 text-xs text-green-600 hover:text-white my-2 hover:bg-green-600 border border-green-600 rounded transition-all duration-700">Update</button>

          {
            count > 0 && catList?.cat == row?._id ? 
            <button onClick={() => handleDeleteCategory(row?._id, row?.categoryImage)} className="w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700">Are you sure ? Click again to confirm</button> : 
            <button onClick={() => askToDeleteCategory(row?._id)} className="w-20 py-2 mx-2 text-xs text-red-600 hover:text-white my-2 hover:bg-red-600 border border-red-600 rounded transition-all duration-700">Delete</button>
          }
          
        </div>
      )
    },
  ];

  const handleDeleteCategory = async (id: string, url: string) => {

    const res = await delete_a_category(id);

    if (res?.success) {
      const imgRes = await delete_an_image(url);
      //console.log(imgRes?.message)
      //toast.success(res?.message)
      mutate('/gettingAllCategoriesFOrAdmin')
    }
    else {
      //toast.error(res?.message)
      throw new Error (res?.message)
    }
  }


  useEffect(() => {
    if (search === '') {
        setFilteredData(catData);
    } else {
        setFilteredData(catData?.filter((item) => {
            const itemData = item?.categoryName.toUpperCase()
            const textData = search.toUpperCase();
            return itemData.indexOf(textData) > -1;
        }))
    }
}, [search, catData])



  return (
    <div className="w-full h-full bg-white">
      <DataTable
        columns={columns}
        data={filteredData || []}
        key={'ThisisCategoryData'}
        pagination
        keyField="id"
        title={`Categories list`} 
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
              placeholder={"Category Name"} />
      }
        className="bg-white px-4 h-4/6"
      />

    </div>
  )
}

