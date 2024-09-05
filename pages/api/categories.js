import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "../../models/Category";

export default async function handler(req, res) {
  const { method } = req;

  await mongooseConnect();

  try {
    if (method === "POST") {
      const { name, parentCategory } = req.body;

      const newCategory = await Category.create({
        name,
        parent: parentCategory,
      });

      res.status(200).json(newCategory);
    }

    if (method === "GET") {
      res.status(200).json(await Category.find().populate("parent")); //adds parent feild with related parent object
    }
  } catch (error) {
    console.log(error);
  }
}
