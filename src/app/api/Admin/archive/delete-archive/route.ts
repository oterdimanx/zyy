import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Archive from "@/model/Archive";


export async function DELETE(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get('id');

      if(!id)  return NextResponse.json({ success: true, message: "Archive ID is Required" });
console.log('DSFDDDDDDDDD')
      const deleteData = await Archive.findByIdAndDelete(id);

      if (deleteData) {
        return NextResponse.json({ success: true, message: "Archive Deleted successfully!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to Delete the archive. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }
  } catch (error) {
    console.log('Error in deleting a new category:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
  }
}
