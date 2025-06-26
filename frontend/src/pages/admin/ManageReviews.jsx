import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllReviews } from "../../services/reviewService";
import ReviewTable from "../../components/admin/ReviewTable";
import HeaderBox from "../../components/common/HeaderBox";
import { FaStar } from "react-icons/fa";

const ManageReviews = () => {
  const { data: reviews = [], isLoading, isError } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: getAllReviews,
  });

  return (
    <div className="bg-[#fffcee] min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ✅ Header */}
        <HeaderBox
          icon={<FaStar className="text-yellow-500 text-xl" />}
          title="Manage Product Reviews"
          subtitle="View and remove inappropriate or duplicate product reviews."
        />

        {/* ✅ Review Table */}
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          {isLoading ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : isError ? (
            <p className="text-red-500">Failed to load reviews.</p>
          ) : (
            <ReviewTable reviews={reviews} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;
