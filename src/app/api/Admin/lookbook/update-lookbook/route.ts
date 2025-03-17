
import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Lookbook from "@/model/Lookbook";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {

      const data = await req.json();
      const  {_id, lookbookName, lookbookImageUrls} = data
      const saveData = await Lookbook.findOneAndUpdate({_id: _id}, {lookbookName : lookbookName, lookbookImageUrls : lookbookImageUrls}  , { new: true });

      if (saveData) {
        //console.log(saveData)
        return NextResponse.json({ success: true, message: "Lookbook updated successfully!" });
      } else {
        //console.log('error')
        return NextResponse.json({ success: false, message: "Failed to update the lookbook. Please try again!" });
      }

    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }

  } catch (error) {

    console.log('Error in update a new lookbook:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });

  }
}
