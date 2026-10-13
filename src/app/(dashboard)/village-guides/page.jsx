"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import ConfirmModal from "@/components/shared/ConfirmModal";
import DataTable from "@/components/shared/DataTable";
import { useVillageGuides, useDeleteVillageGuide } from "@/hooks/useVillageGuides";
import { showToast, errorMessage } from "@/lib/toast";

export default function VillageGuidesPage() {
  const { data: guides = [], isLoading } = useVillageGuides();
  const deleteMutation = useDeleteVillageGuide();
  const [guideToDelete, setGuideToDelete] = useState(null);

  const handleDelete = async () => {
    if (!guideToDelete) return;
    try {
      await deleteMutation.mutateAsync(guideToDelete.id);
      setGuideToDelete(null);
      showToast.success(`"${guideToDelete.village}" guide deleted.`);
    } catch (err) {
      showToast.error(errorMessage(err, "Failed to delete village guide."));
    }
  };

  const columns = [
    {
      header: "Village & Region",
      render: (row) => (
        <div>
          <p className="font-bold text-admin-text text-sm">{row.village}</p>
          <p className="text-xs text-gold font-medium mt-0.5">📍 {row.region}</p>
        </div>
      ),
    },
    {
      header: "Cultural & Travel Insights",
      render: (row) => (
        <p className="text-xs text-admin-muted line-clamp-2 max-w-xl">
          {row.content}
        </p>
      ),
    },
    {
      header: "Tags",
      render: (row) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {(row.tags || []).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded text-[10px] bg-mist border border-admin-border text-admin-text"
            >
              #{tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/village-guides/${row.id}`}
            className="text-xs font-semibold text-gold hover:underline"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setGuideToDelete(row)}
            className="text-xs font-semibold text-red-400 hover:text-red-300"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Village Guides"
        subtitle="Manage cultural knowledge and travel guides used across the platform and by the AI assistant."
        actionText="Add Village Guide"
        actionHref="/village-guides/new"
        actionIcon={<span className="text-base font-bold">+</span>}
      />

      <DataTable
        columns={columns}
        data={guides}
        isLoading={isLoading}
        emptyMessage="No village guides found. Click 'Add Village Guide' to create one."
      />

      <ConfirmModal
        isOpen={!!guideToDelete}
        title={`Delete Guide for "${guideToDelete?.village}"?`}
        message="This will remove the village guide from the database and AI context. Are you sure?"
        confirmText="Yes, Delete Guide"
        confirmVariant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setGuideToDelete(null)}
      />
    </div>
  );
}
