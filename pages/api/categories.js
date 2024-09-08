import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "../../models/Category";

export default async function handler(req, res) {
  const { method } = req;

  await mongooseConnect();

  try {
    if (method === "POST") {
      const { name, parentCategory, properties } = req.body;

      const newCategory = await Category.create({
        name,
        parent: parentCategory || undefined,
        properties,
      });

      res.status(200).json(newCategory);
    }

    if (method === "GET") {
      res.status(200).json(await Category.find().populate("parent")); //adds parent feild with related parent object
    }

    if (method === "PUT") {
      const { _id, name, parentCategory, properties } = req.body;
      // res.status(200).json({ _id, name, parentCategory });
      const user = await Category.updateOne(
        { _id },
        { name, parent: parentCategory || undefined, properties }
      );
      if (user) {
        res.status(200).json(user);
      }
    }

    if (method === "DELETE") {
      try {
        const { _id } = req.query;
        const user = await Category.deleteOne({ _id });

        if (user) {
          res.status(200).json(user);
        }
      } catch (error) {
        console.log("error in backend delete : ", error);
      }
    }
  } catch (error) {
    console.log(error);
  }
}
