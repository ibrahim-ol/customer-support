import { setupView } from "../../../utils/view.tsx";
import { DeleteConfirmationModal } from "./delete-confirmation.tsx";
import { ProductModal } from "./manage-product.tsx";
import { ProductTable } from "./product-table.tsx";
import { useManageProduct } from "./hooks.tsx";
import { AdminAlternateHeader } from "../../components/admin-header.tsx";

export const AdminProductsView = () => {
  const {
    productApi,
    isSubmitting,
    handleFormSubmit,
    handleDelete,
    selectedProduct,
    isManageModalOpen,
    isDeleteModalOpen,
    addProduct,
    setToDelete,
    setToEdit,
    closeModal,
  } = useManageProduct();

  const products = productApi.data?.data ?? [];

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Header */}
      <AdminAlternateHeader
        title="Product Management"
        subtitle="Manage your products - add, edit, and delete items"
        button={{ label: "Add New Product", onClick: addProduct }}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {productApi.isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading products...</span>
          </div>
        ) : productApi.error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-800">{productApi.error}</p>
            <button
              onClick={productApi.refresh}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400 mt-2">
                  Get started by adding your first product
                </p>
                <button
                  onClick={addProduct}
                  className="mt-4 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add First Product
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <ProductTable
                  products={products}
                  onEdit={setToEdit}
                  onDelete={setToDelete}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isManageModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        product={selectedProduct?.name ?? ""}
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
};

// Client-side entry point
setupView(AdminProductsView);
