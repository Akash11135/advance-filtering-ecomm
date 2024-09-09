import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "./Layout";
import axios from "axios";
import Spinners from "./Spinners";
import { set } from "mongoose";

export default function ProductForm({
  _id, //flow of componetnts in next.js
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || 0);
  const [goToProducts, setGoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || []);
  const [categories, setCategories] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [categoryName, setCategoryName] = useState(existingCategory || "");

  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((res) => setCategories(res.data));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      categoryName,
    };
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
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }

      const res = await axios.post("/api/upload", data);
      setImages((oldImage) => [...oldImage, ...res.data?.links]);
      setIsUploading(false);
    }
  }
  let categoryArr;
  if (categories) {
    categoryArr = categories.filter((category) => {
      if (category._id === categoryName) {
        return category;
      }
    });
  }
  // console.log(categoryArr);
  return (
    <form onSubmit={handleSave}>
      <label>Product Name</label>
      <input
        type="text"
        placeholder="name of products"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Categories</label>
      <select
        className="p-1"
        value={categoryName}
        onChange={(ev) => setCategoryName(ev.target?.value)}
      >
        <option value="">Uncategorised</option>
        {categories?.length > 0 &&
          categories.map((category) => (
            <option value={category._id} key={category._id}>
              {category.name}
            </option>
          ))}
      </select>
      <label>Photos</label>
      <div className="mb-2 flex gap-2 flex-wrap ">
        {!!images?.length &&
          images.map((link) => (
            <div key={link}>
              <img src={link} className="h-24 w-24 rounded-lg" />
            </div>
          ))}
        {isUploading && (
          <div className="h-24 flex items-center justify-center ">
            <Spinners />
          </div>
        )}
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
        <div className="flex items-center justify-center">
          {images?.length <= 0 ? <div>No photos in this product.</div> : null}
        </div>
      </div>
      <div className="mt-2 mb-2">
        <label>Properties</label>
        <div className="mt-1">
          {categoryArr?.length > 0 &&
            categoryArr.map((category) =>
              category?.properties?.map((p) => (
                <div className="flex gap-3 justify-center items-center">
                  <h2 className="w-[10%]">{p.name} : </h2>
                  <select>
                    {typeof p?.value === "string"
                      ? p.value
                          ?.split(",")
                          .map((v) => <option value={v}>{v}</option>)
                      : p.value.map((v) => {
                          v;
                        })}
                  </select>
                </div>
              ))
            )}
        </div>
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
