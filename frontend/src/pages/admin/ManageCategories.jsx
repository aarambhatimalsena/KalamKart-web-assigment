import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCategories, deleteCategory } from "../../services/categoryService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/common/ConfirmModal";
import CategoryTable from "../../components/admin/CategoryTable";
import HeaderBox from "../../components/common/HeaderBox"; // ✅ Reusable header
import { FaList } from "react-icons/fa";

const ManageCategories = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Fetch categories
  const { data: categories = [], isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // Delete mutation
  const { mutate: deleteHandler } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries(["categories"]);
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
  });

  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      deleteHandler(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="bg-[#fffcee] min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* ✅ Styled Header */}
        <HeaderBox
          icon={<FaList className="text-purple-500" />}
          title="Manage Categories"
          subtitle="View, create, and delete product categories."
          action={
            <button
              onClick={() => navigate("/admin/categories/add")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
            >
              + Add New Category
            </button>
          }
        />

        {/* ✅ Main Table Section */}
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          {isLoading ? (
            <p>Loading categories...</p>
          ) : isError ? (
            <p className="text-red-500">Failed to load categories.</p>
          ) : (
            <CategoryTable
              categories={categories}
              onDelete={(id) => setConfirmDeleteId(id)}
            />
          )}
        </div>
      </div>

      {/* ✅ Confirm Modal */}
      <ConfirmModal
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
      />
    </div>
  );
};

export default ManageCategories;
