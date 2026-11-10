import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { updateProduct } from "../../redux/slices/adminProductSlice";
import { fetchProductDetails } from "../../redux/slices/productsSlice";

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false); // Image uploading state

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData }));
    navigate("/admin/products");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mx-auto max-w-7xl rounded-md p-6 shadow-md">
      <h2 className="mb-6 text-3xl font-bold">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="mb-2 block font-semibold">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 p-2"
            required
          />
        </div>
        <div className="mb-6">
          <label className="mb-2 block font-semibold">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 p-2"
            rows={4}
            required
          />
        </div>
        <div className="mb-6">
          <label className="mb-2 block font-semibold">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div className="mb-6">
          <label className="mb-2 block font-semibold">Count in Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div className="mb-6">
          <label className="mb-2 block font-semibold">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div className="mb-6">
          <label className="mb-2 block font-semibold">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(",")}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((size) => size.trim()),
              })
            }
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        <div className="mb-6">
          <label className="mb-2 block font-semibold">
            Colors (comma-separated)
          </label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(",")}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((color) => color.trim()),
              })
            }
            className="w-full rounded-md border border-gray-300 p-2"
          />
        </div>
        {/* Image upload */}
        <div className="mb-6">
          <label className="mb-2 block font-semibold">Upload Image</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p>Uploading Image...</p>}
          <div className="mt-4 flex gap-4">
            {productData.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt={image.altText || "Product Image"}
                  className="size-20 rounded-md object-cover shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-green-500 py-2 text-white transition-colors hover:bg-green-600"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
