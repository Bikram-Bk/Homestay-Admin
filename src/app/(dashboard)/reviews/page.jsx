"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { useReviews, useDeleteReview } from "@/hooks/useReviews";
import { showToast, errorMessage } from "@/lib/toast";

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const { data: response, isLoading } = useReviews({ page, limit: 12 });
  const deleteMutation = useDeleteReview();

  const reviews = response?.data || [];
  const meta = response?.meta || { page: 1, totalPages: 1 };

  const handleDelete = async () => {
    if (!reviewToDelete) return;
    try {
      await deleteMutation.mutateAsync(reviewToDelete.id);
      setReviewToDelete(null);
      showToast.success("Review deleted.");
    } catch (err) {
      showToast.error(errorMessage(err, "Failed to delete review."));
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5 text-gold text-xs">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {star <= rating ? "★" : "☆"}
          </span>
        ))}
        <span className="ml-1 text-admin-text font-bold text-xs">{rating}.0</span>
      </div>
    );
  };

  const columns = [
    {
      header: "Guest",
      render: (row) => (
        <div>
          <p className="font-semibold text-admin-text text-sm">{row.user?.name || "Traveler"}</p>
          <p className="text-xs text-admin-muted font-mono">{row.user?.email || "—"}</p>
        </div>
      ),
    },
    {
      header: "Homestay",
      render: (row) => (
        <div>
          <p className="font-medium text-admin-text text-sm">{row.homestay?.name || "Homestay"}</p>
          <p className="text-xs text-admin-muted">{row.homestay?.village || "Nepal"}</p>
        </div>
      ),
    },
    {
      header: "Rating",
      render: (row) => renderStars(row.rating),
    },
    {
      header: "Comment",
      render: (row) => (
        <p className="text-xs text-admin-muted max-w-md line-clamp-2 italic">
          "{row.comment}"
        </p>
      ),
    },
    {
      header: "Date",
      render: (row) => (
        <span className="text-xs text-admin-muted">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Action",
      className: "text-right",
      render: (row) => (
        <button
          type="button"
          onClick={() => setReviewToDelete(row)}
          className="text-xs font-semibold text-red-400 hover:text-red-300"
        >
          Remove
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Review Moderation"
        subtitle="Manage community reviews, feedback, and customer ratings."
      />

      <DataTable
        columns={columns}
        data={reviews}
        isLoading={isLoading}
        emptyMessage="No reviews to moderate at this time."
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      <ConfirmModal
        isOpen={!!reviewToDelete}
        title="Delete Review?"
        message="Are you sure you want to permanently remove this customer review? It will no longer affect the homestay rating."
        confirmText="Yes, Delete Review"
        confirmVariant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setReviewToDelete(null)}
      />
    </div>
  );
}
