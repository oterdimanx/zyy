import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Archive from "@/model/Archive";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const data = await req.json();
      const  {_id, name, description, image, slug, type} = data

      const saveData = await Archive.findOneAndUpdate({_id: _id}, {archiveName : name, archiveDescription : description, archiveImage: image, archiveSlug: slug, archiveType: type}  , { new: true });
      //const saveData = false;
      console.log(saveData)
      if (saveData) {
        //console.log(saveData)
        return NextResponse.json({ success: true, message: "Archive updated successfully!" });
      } else {
        //console.log('error')
        return NextResponse.json({ success: false, message: "Failed to update the archive. Please try again!" });
      }

    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }

  } catch (error) {

    console.log('Error in update a new archive:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });

  }
}