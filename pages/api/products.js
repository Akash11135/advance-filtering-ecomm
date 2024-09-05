import { Product } from "@/models/products";
import { mongooseConnect } from "@/lib/mongoose";

// product handle functions

export default async function handle(req, res) {
  const { method } = req;
  mongooseConnect();
  //add a product
  if (method === "POST") {
    const { title, description, price, images } = req.body;

    Product.create({
      title,
      description,
      price,
      images,
    });
    res.json(req.body);
  }
  //get all products

  if (method === "GET") {
    //edit product
    if (req.query?.id) {
      res.status(200).json(await Product.findOne({ _id: req.query.id }));
    }
    res.status(200).json(await Product.find());
  }

  if (method === "PUT") {
    const { title, description, price, _id, images } = req.body;
    console.log("images", { images });
    await Product.updateOne({ _id }, { title, description, price, images });
    res.status(200).json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query.id });
      res.status(200).send({ mes: "deleted" });
    } else {
      res.status(200).send({ msg: "no data present" });
    }
  }
}
