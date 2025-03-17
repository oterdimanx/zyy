import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Lookbook from "@/model/Lookbook";
import Joi from "joi";


const AddLookbookSchema  = Joi.object({
  lookbookName : Joi.string().required(),
  lookbookImageUrls  : Joi.string().required(),
})


export const dynamic  = 'force-dynamic'

export async function POST(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const data = await req.json();
      const {lookbookName, lookbookImageUrls} =  data;
      
      const { error } = AddLookbookSchema.validate({lookbookName, lookbookImageUrls});

      if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

      const saveData = await Lookbook.create(data);

      if (saveData) {
        return NextResponse.json({ success: true, message: "Lookbook added successfully!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to add the lookbook. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }
  } catch (error) {
    console.log('Error in adding a new lookbook:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
  }
}
