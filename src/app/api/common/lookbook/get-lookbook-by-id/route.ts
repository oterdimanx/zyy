import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Lookbook from "@/model/Lookbook";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  await connectDB();
  try {
    const { searchParams, } = new URL(req.url);
    const id = searchParams.get('id');

    if(!id) return NextResponse.json({status: 400 , success: false, message: 'Please provide lookbook id.' });

  
    const isAuthenticated = await AuthCheck(req);
   
    const getData = await Lookbook.findById(id);
    if (getData) {
      return NextResponse.json({success  :true , data : getData});
    } else {
      return NextResponse.json({status: 204 , success: false, message: 'No lookbook found.' });
    }
    
  } catch (error) {
    console.log('Error in getting lookbooks by id:', error);
    return NextResponse.json({status : 500 , success: false, message: 'Something went wrong. Please try again!' });
  }
}
