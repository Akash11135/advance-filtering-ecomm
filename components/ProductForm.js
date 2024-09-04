import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "./Layout";
import axios from "axios";

export default function ProductForm({
  _id, //floe of componetnts in next.js
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || 0);
  const [goToProducts, setGoToProducts] = useState(false);

  const router = useRouter();

  const handleSave = async (e) => {
    e.preventDefault();
    const data = { title, description, price };
    if (_id) {
      //update product

      await axios.put("/api/products", { ...data, _id });
    } else {
      //add new product
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  };

  if (goToProducts) {
    router.push("/products");
  }

  return (
    <form onSubmit={handleSave}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="name of products"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Product Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <label>Price in USD</label>
      <input
        type="number"
        placeholder="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button className="btn-primary" type="submit">
        Save
      </button>
    </form>
  );
}
