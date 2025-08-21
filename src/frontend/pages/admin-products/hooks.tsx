import { useState } from "hono/jsx";
import { useApi, useFetch } from "../../hooks/useApi.ts";
import { Product, ProductFormData } from "./types.ts";

export function useManageProduct() {
  const productApi = useFetch<{ data: Product[] }>("/admin/api/products", true);

  const [modalType, setModalType] = useState<
    "create" | "edit" | "delete" | null
  >(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const editApi = useApi();
  const deleteApi = useApi();
  const isSubmitting = editApi.isLoading || deleteApi.isLoading;
  // Handle form submission (create/update)
  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      const url = selectedProduct
        ? `/admin/api/products/${selectedProduct.id}`
        : "/admin/api/products";

      const method = selectedProduct ? "PUT" : "POST";

      await editApi.execute(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          price: parseFloat(data.price),
          description: data.description,
        }),
      });
      closeModal();
      await productApi.refresh(); // Refresh the list
    } catch (err) {
      alert("Failed to save product");
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(
        `/admin/api/products/${selectedProduct.id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (result.success) {
        closeModal();
        await productApi.refresh(); // Refresh the list
      } else {
        alert(result.error || "Failed to delete product");
      }
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  function setToEdit(product: Product) {
    setSelectedProduct(product);
    setModalType("edit");
  }
  function addProduct() {
    setSelectedProduct(null);
    setModalType("create");
  }

  function setToDelete(product: Product) {
    setSelectedProduct(product);
    setModalType("delete");
  }
  function closeModal() {
    setModalType(null);
    setSelectedProduct(null);
  }

  const isManageModalOpen = modalType === "edit" || modalType === "create";
  const isDeleteModalOpen = modalType === "delete";

  return {
    isSubmitting,
    handleFormSubmit,
    handleDelete,
    selectedProduct,
    isManageModalOpen,
    isDeleteModalOpen,
    setToEdit,
    addProduct,
    setToDelete,
    closeModal,
    productApi,
  };
}
