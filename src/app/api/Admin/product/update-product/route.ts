import connectDB from "@/DB/connectDB";
import AuthCheck from "@/middleware/AuthCheck";
import { NextResponse } from "next/server";
import Product from "@/model/Product";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const isAuthenticated = await AuthCheck(req);

    if (isAuthenticated === 'admin') {
      const data = await req.json();
      const  {name, _id, description, slug, quantity, price, categoryID, feature, image, image2, image3} = data

      const saveData = await Product.findOneAndUpdate({_id: _id} , { productName : name , productDescription : description , productSlug: slug , productPrice : price ,  productQuantity : quantity ,  productCategory : categoryID, productFeatured : feature, productImage : image, productImage2 : image2, productImage3 : image3  }  , { new: true });

      if (saveData) {

        return NextResponse.json({ success: true, message: "product  updated successfully!" });

      } else {

        return NextResponse.json({ success: false, message: "Failed to update the product . Please try again!" });

      }

    } else {

      return NextResponse.json({ success: false, message: "You are not authorized." });

    }

  } catch (error) {

    console.log('Error in update a new product :', error);
    return NextResponse.json({ success: false, message: 'Something went wrong. Please try again!' });

  }
}
