import Layout from "@/components/Layout";
import axios from "axios";
import { withSwal } from "react-sweetalert2";

import { useEffect, useState } from "react";

function Category({ swal }) {
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [properties, setProperties] = useState([]);

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
          properties,
        });
        setEditCategory(null);
        setName("");
        setParentCategory("");
        setProperties([]);
      } else {
        await axios.post("/api/categories", {
          name,
          parentCategory,
          //below id done because in backend we want array of object, but here its taken from input hanece it acts as strings.
          properties: properties.map((item) => ({
            name: item.name,
            value: item.value.split(","),
          })),
        });
        setName("");
        setParentCategory("");
        setProperties([]);
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
    setProperties(
      category.properties.map(({ name, value }) => ({
        name,
        value: Array.isArray(value) ? value.join(",") : value, // Check if value is an array before joining
      }))
    );
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
  const addProperty = () => {
    setProperties((prev) => {
      return [...prev, { name: "", value: "" }];
    });
  };

  const handlePropertyName = (index, newValue) => {
    setProperties((prev) => {
      const updatedProperties = [...prev];
      updatedProperties[index].name = newValue;
      return updatedProperties;
    });
  };

  const handlePropertyValue = (index, newValue) => {
    setProperties((prev) => {
      const updatedProperties = [...prev];
      updatedProperties[index].value = newValue;
      return updatedProperties;
    });
  };

  const removeProperty = (index, property) => {
    const updatedProperties = properties.filter((prop) => prop !== property);
    setProperties(updatedProperties);
  };
  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editCategory
          ? `Edit category ${editCategory.name}`
          : "Create New Category."}
      </label>
      <form className="" onSubmit={saveCategory}>
        <div className="flex gap-2">
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
              categories.map((category, index) => (
                <option key={index} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-1">
          <label className="block">Properties</label>
          <button type="button" className="btn-default" onClick={addProperty}>
            Add new Property
          </button>
          {properties?.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="flex gap-2 mt-2 ">
                <input
                  className="mb-0"
                  type="text"
                  placeholder="Enter property name"
                  value={property.name}
                  onChange={(ev) => handlePropertyName(index, ev.target.value)}
                />
                <input
                  type="text"
                  className="mb-0"
                  placeholder="Enter property value"
                  value={property.value}
                  onChange={(ev) => handlePropertyValue(index, ev.target.value)}
                />
                <button
                  className="btn-default "
                  onClick={() => removeProperty(index, property)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <button className="btn-primary mt-2" type="submit">
          Save
        </button>
        {editCategory && (
          <button
            onClick={() => {
              setEditCategory(null);
              setName("");
              setParentCategory("");
            }}
            type="button"
            className="btn-default ml-2"
          >
            Cancel
          </button>
        )}
      </form>
      {!editCategory && (
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
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => {
  return <Category swal={swal} />;
});
