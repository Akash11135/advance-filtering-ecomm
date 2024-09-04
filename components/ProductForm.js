import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "./Layout";
import axios from "axios";

export default function ProductForm({
  _id, //floe of componetnts in next.js
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images,
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

  async function uploadImages(ev) {
    const files = ev.target?.files;

    if (files?.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      console.log(res);
    }
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
      <label>Photos</label>
      <div className="mb-2">
        <label className="cursor-pointer w-24 h-24 hover:border-2 hover:border-gray-600 flex justify-center items-center gap-2 text-gray-500 rounded-lg bg-gray-300 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>
            Upload
            <input type="file" className="hidden" onChange={uploadImages} />
          </div>
        </label>
        {!images?.length && <div>No photos in this product.</div>}
      </div>
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
