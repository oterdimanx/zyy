import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Archive from "@/model/Archive";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams, } = new URL(req.url);
    const id = searchParams.get('id');

    if(!id) return NextResponse.json({status: 400 , success: false, message: 'Please provide an archive id.' });

  
    const isAuthenticated = await AuthCheck(req);
   
    const getData = await Archive.findById(id);
    if (getData) {
      return NextResponse.json({success  :true , data : getData});
    } else {
      return NextResponse.json({status: 204 , success: false, message: 'No archives found.' });
    }
    
  } catch (error) {
    console.log('Error in getting  categories by id:', error);
    return NextResponse.json({status : 500 , success: false, message: 'Something went wrong. Please try again!' });
  }
}
