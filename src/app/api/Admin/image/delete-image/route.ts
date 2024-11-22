import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import { storage } from '@/utils/Firebase'
import { ref, deleteObject } from 'firebase/storage';

export async function DELETE(req: Request) {
    try {
      const isAuthenticated = await AuthCheck(req);
  
      if (isAuthenticated === 'admin') {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
  
        if(!id)  return NextResponse.json({ success: true, message: "Image url is Required" });
  
        const deleteFromStorageRef = ref(storage, `${id}`);
        const deleteData = deleteObject(deleteFromStorageRef);

        deleteData.then(() => {
            return NextResponse.json({ success: true, message: "Image Deleted successfully!"});
        }).catch((error) => {
            return NextResponse.json({ success: false, message: error });
        })

        return NextResponse.json({ success: true, message: "Image Deleted successfully!*"});

      } else {
        return NextResponse.json({ success: false, message: "You are not authorized." });
      }
    } catch (error) {
      console.log('Error in deleting an image:', error);
      return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
    }
  }