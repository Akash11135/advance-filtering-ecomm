import Layout from "@/components/Layout";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

import { useEffect, useState } from "react";

function Category({ swal }) {
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);

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
      if (editCategory) {
        const _id = editCategory?._id;
        await axios.put("/api/categories", {
          _id,
          name,
          parentCategory,
        });
        setEditCategory(null);
        setName("");
        setParentCategory();
      } else {
        await axios.post("/api/categories", { name, parentCategory });
        setName("");
      }

      fetchCategory();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (category) => {
    setEditCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  };

  const handleDelete = async (category) => {
    swal
      .fire({
        title: "Are you sure?",
        text: `do you want to delete ${category?.name}`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete",
        reverseButtons: true,
        confirmButtonColor: "#d55",
      })
      .then(async (result) => {
        // when confirmed and promise resolved==>isConfired:true/false...
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategory();
        }
      });
  };

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editCategory
          ? `Edit category ${editCategory.name}`
          : "Create New Category."}
      </label>
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
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories?.length > 0 &&
            categories.map((category) => (
              <tr key={categories._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button
                    onClick={() => handleEdit(category)}
                    className="btn-primary mr-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="btn-primary"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => {
  return <Category swal={swal} />;
});
