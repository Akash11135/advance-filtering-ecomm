import Layout from "@/components/Layout";
import axios from "axios";

import { useEffect, useState } from "react";

export default function Category({ name: existingCategoryName }) {
  const [name, setName] = useState(existingCategoryName || "");
  const [parentCategory, setParentCategory] = useState();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategory();
  }, []);

  //to basically reload the page on entry.

  const fetchCategory = () => {
    axios.get("/api/categories").then((res) => setCategories(res.data));
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/categories", { name, parentCategory });
      setName("");
      fetchCategory();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <h1>Categories</h1>
      <label>New Category Name</label>
      <form className="flex gap-2" onSubmit={saveCategory}>
        <input
          type="text"
          className="mb-0"
          placeholder=" name of the category"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="mb-0"
          value={parentCategory}
          onChange={(ev) => setParentCategory(ev.target?.value)}
        >
          <option value={0}>No parent category.</option>
          {categories?.length > 0 &&
            categories.map((category) => (
              <option value={category._id}>{category.name}</option>
            ))}
        </select>
        <button className="btn-primary" type="submit">
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category Name</td>
            <td>Parent Category Name</td>
          </tr>
        </thead>
        <tbody>
          {categories?.length > 0 &&
            categories.map((category) => (
              <tr key={categories._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
