import connectDB from "@/DB/connectDB";
//import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Lookbook from "@/model/Lookbook";

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  await connectDB();
  try {

      const getData = await Lookbook.find({});
      if (getData) {
        return NextResponse.json({success  :true , data : getData});
      } else {
        return NextResponse.json({status: 204 , success: false, message: 'No lookbook found.' });
      }
   
  } catch (error) {
    console.log('Error in getting all lookbooks:', error);
    return NextResponse.json({status : 500 , success: false, message: 'Something went wrong. Please try again!' });
  }
}
