import { useState } from "react";
import { productApi } from "../lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProductParams } from "../interface/interfaces";
import { getStockStatusBadge } from "../lib/utils";
import { ImageIcon, PencilIcon, Trash2Icon, XIcon } from "lucide-react";
import type { AxiosError } from "axios";

function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsInPage, setItemsInPage] = useState(10);
  const [archivingProductId, setArchivingProductId] = useState<string | null>();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductParams | null>(
    null,
  );
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<File[] | string[]>([]);
  const [errors, setErrors] = useState<string | null>(null);

  const { data: products = [], isFetching } = useQuery({
    queryKey: ["products", itemsInPage],
    queryFn: () => productApi.getAll(itemsInPage),
    refetchOnWindowFocus: false, // Prevents re-fetch on tab switch
    staleTime: 5000, // 5 seconds
  });

  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      closeModal();
      setErrors(null);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: AxiosError) => {
      // 1. Check if the server actually sent a response
      if (error.response && error.response.data) {
        // 2. Extract the 'error' field you defined in your backend
        const errorMessage =
          (error.response.data as { error?: string }).error ||
          "Something went wrong";
        setErrors(errorMessage);
      } else {
        // 3. Handle cases where the server is down or network is lostf
        setErrors(error.message || "Network Error");
      }
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: productApi.update,
    onSuccess: () => {
      closeModal();
      setErrors(null);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: AxiosError) => {
      // 1. Check if the server actually sent a response
      if (error.response && error.response.data) {
        // 2. Extract the 'error' field you defined in your backend
        const errorMessage =
          (error.response.data as { error?: string }).error ||
          "Something went wrong";
        setErrors(errorMessage);
      } else {
        // 3. Handle cases where the server is down or network is lost
        setErrors(error.message || "Network Error");
      }
    },
  });
  const archiveProductMutation = useMutation({
    mutationFn: productApi.patch,
    onSuccess: () => {
      setArchivingProductId(null);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: AxiosError) => {
      setArchivingProductId(null);
      // 1. Check if the server actually sent a response
      if (error.response && error.response.data) {
        // 2. Extract the 'error' field you defined in your backend
        const errorMessage =
          (error.response.data as { error?: string }).error ||
          "Something went wrong";
        setErrors(errorMessage);
      } else {
        // 3. Handle cases where the server is down or network is lost
        setErrors(error.message || "Network Error");
      }
    },
  });

  const closeModal = () => {
    setShowModal(false);
    setErrors(null);
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
    });
    setImages([]);
    // Revoke previous object URLs to prevent memory leaks
    imagePreviews.forEach((preview) => {
      if (typeof preview === "string" && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });
    setImagePreviews([]);
  };

  const handleEdit = (product: ProductParams) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
    });
    setImagePreviews(product.images);
    setShowModal(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageChange = (e: any) => {
    const files = Array.from(e.target.files ?? []) as File[];
    if ((files.length ?? 0) > 3) return alert("Maximum of 3 images allowed");
    // Revoke previous object URLs to prevent memory leaks
    imagePreviews.forEach((preview) => {
      if (typeof preview === "string" && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    //doesn't refresh the page once we submit
    e.preventDefault();
    if (!editingProduct && (imagePreviews.length ?? 0) === 0)
      return alert("Please upload at least one image");

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("category", formData.category);

    //only append new images if their selected

    if ((images.length ?? 0) > 0)
      images.forEach((image) => formDataToSend.append("images", image));

    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct._id,
        formData: formDataToSend,
      });
    } else {
      createProductMutation.mutate(formDataToSend);
    }
  };

  return (
    <div className="space-y-6">
      {/* header */}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-base-content/70 mt-1">Manage Product Inventory</p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            setErrors(null);
          }}
          className="btn btn-primary gap-2"
        >
          Add product
        </button>
      </div>
      {/* Product Grid */}
      <div className="grid grid-rows-1-1 gap-4">
        {!isFetching &&
          products.products.map((product: ProductParams) => {
            const status = getStockStatusBadge(product.stock);
            return (
              //container card
              <div key={product._id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  {/*image */}
                  <div className="flex items-center gap-6">
                    <div className="avatar">
                      <div className="w-20 rounded-xl">
                        <img
                          src={(product.images[0] || "").toString()}
                          alt={product.name}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="card-title">{product.name}</h3>
                          <p className="text-base-content/70 text-sm">
                            {product.category}
                          </p>
                        </div>
                        <div className={`badge ${status.class}`}>
                          {status.text}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 mt-4">
                        <div>
                          <p className="text-xs text-base-content/70">Price</p>
                          <p className="font-bold text-lg">${product.price}</p>
                        </div>
                        <div>
                          <p className="text-xs text-base-content/70">Stock</p>
                          <p className="font-bold text-lg">
                            {product.stock} units
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="card-actions">
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => handleEdit(product)}
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        disabled={archivingProductId === product._id}
                        className="btn btn-square btn-ghost text-error"
                        onClick={() => {
                          setArchivingProductId(product._id);
                          archiveProductMutation.mutate(product._id);
                        }}
                      >
                        {archivingProductId === product._id ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          <Trash2Icon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        {!isFetching && (products?.totalPages ?? 0) > 0 && (
          <div className="flex items-center justify-center space-x-2">
            {Array.from({ length: products.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => {
                    setItemsInPage(page * 10);
                    setCurrentPage(page);
                  }} // Assuming you have a state for current page
                  className={`btn btn-sm justify-center ${currentPage === page ? "btn-primary" : "btn-outline"}`}>
                  {page}
                </button>
              ),
            )}
          </div>
        )}
      </div>

      {/* Add edit modal */}
      <input
        type="checkbox"
        id="my_modal_6"
        className="modal-toggle"
        checked={showModal}
        readOnly
      />
      <div className="modal">
        <div className="modal-box max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-2xl">
              {editingProduct ? "Edit Product" : "Add product"}
            </h3>
            <button
              onClick={closeModal}
              className="btn btn-sm btn-circle btn-ghost"
            >
              <XIcon className="size-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span>Product Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="input input-bordered"
                  value={formData.name}
                  // ...formData — The Spread Operator
                  // This is the most critical part of updating objects in React. State in React is immutable, meaning you shouldn't modify the original object directly.
                  // ...formData says: "Take a copy of all the current fields (price, stock, description, etc.) and bring them into this new object."
                  // If you forgot this, your price and stock would disappear the moment you started typing the name!
                  //...formData means leave eveything as it is
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span>Category</span>
                </label>
                <select
                  className="select select-bordered"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
            </div>
            {/* Second row */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="form-control">
                <label className="label">
                  <span>Price ($)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="input input-bordered"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span>Stock</span>
                </label>
                <input
                  type="number"
                  step="1.00"
                  placeholder="0.00"
                  className="input input-bordered"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-control flex flex-col gap-2">
              <label className="label">Description</label>
              <textarea
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Enter product description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-base flex items-center gap-2">
                  <ImageIcon className="size-5" />
                  Product Images
                </span>
                <span className="label-text-alt text-xs opacity-60">
                  Max 3 images
                </span>
              </label>

              <div className="bg-base-200 rounded-xl p-4 border-2 border-dashed border-base-300 hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="file-input file-input-bordered file-input-primary w-full"
                  required={!editingProduct}
                />

                {editingProduct && (
                  <p className="text-xs text-base-content/60 mt-2 text-center">
                    Leave empty to keep current images
                  </p>
                )}
              </div>
              {(imagePreviews.length ?? 0) > 0 && (
                <div className="flex gap-2 mt-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="avatar">
                      <div className="w-20 rounded-lg">
                        <img
                          src={preview as string}
                          alt={`Preview ${index + 1}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-action">
              <button
                className="btn"
                type="button"
                disabled={
                  createProductMutation.isPending ||
                  updateProductMutation.isPending
                }
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={
                  createProductMutation.isPending ||
                  updateProductMutation.isPending
                }
              >
                {createProductMutation.isPending ||
                updateProductMutation.isPending ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : editingProduct ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
            {errors ? (
              <div className="badge badge-error my-5 self-center">{errors}</div>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
