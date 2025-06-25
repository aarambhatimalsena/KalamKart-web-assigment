import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen } from "react-icons/fa";

import ProductTable from "../../components/admin/ProductTable";
import ConfirmModal from "../../components/common/ConfirmModal";
import HeaderBox from "../../components/common/HeaderBox"; // ✅ new reusable box

const ManageProducts = () => {
  const navigate = useNavigate();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  return (
    <div className="bg-[#fffcee] min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* ✅ Reusable Header */}
        <HeaderBox
          icon={<FaBoxOpen className="text-pink-500" />}
          title="Manage Products"
          subtitle="View, add, or delete product listings from your store."
          action={
            <button
              onClick={() => navigate("/admin/products/add")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
            >
              + Add New Product
            </button>
          }
        />

        {/* ✅ Product Table */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <ProductTable onDeleteRequest={(id) => setConfirmDeleteId(id)} />
        </div>
      </div>

      {/* ✅ Confirm Modal */}
      <ConfirmModal
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          document.dispatchEvent(
            new CustomEvent("confirm-delete-product", {
              detail: confirmDeleteId,
            })
          );
          setConfirmDeleteId(null);
        }}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
      />
    </div>
  );
};

export default ManageProducts;
