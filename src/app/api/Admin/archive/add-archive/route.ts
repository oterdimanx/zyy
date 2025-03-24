import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Archive from "@/model/Archive";
import Joi from "joi";


const AddArchiveSchema  = Joi.object({
  archiveName  : Joi.string().required(),
  archiveImgUrls  : Joi.string(),
  archiveLookbookCreatedAt  : Joi.date(),
  archiveType  : Joi.string().required(),
  archiveDescription  : Joi.string().required(),
  archiveImage  : Joi.string().required(),
  archiveSlug  : Joi.string().required(),
  archiveDate  : Joi.date(),
})


export const dynamic  = 'force-dynamic'

export async function POST(req: Request) {

  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {


      const data = await req.json();
      
      const {archiveName , archiveImgUrls , archiveLookbookCreatedAt , archiveType , archiveDescription, archiveImage, archiveSlug, archiveDate } =  data;

      const { error } = AddArchiveSchema.validate({archiveName , archiveImgUrls , archiveLookbookCreatedAt , archiveType , archiveDescription, archiveImage, archiveSlug, archiveDate});
      
      if (error) return NextResponse.json({ success: false, message: error.details[0].message.replace(/['"]+/g, '') });

      const saveData = await Archive.create(data);
      
      if (saveData) {
        return NextResponse.json({ success: true, message: "Archive added successfully!" });
      } else {
        return NextResponse.json({ success: false, message: "Failed to add the archive. Please try again!" });
      }
    } else {
      return NextResponse.json({ success: false, message: "You are not authorized." });
    }
  } catch (error) {
    console.log('Error in adding a new archive:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });
  }
}
