"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { useHomestays, useDeleteHomestay } from "@/hooks/useHomestays";
import { showToast, errorMessage } from "@/lib/toast";

export default function HomestaysPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [homestayToDelete, setHomestayToDelete] = useState(null);

  const { data: response, isLoading } = useHomestays({
    search: searchTerm || undefined,
    limit: 50,
  });

  const deleteMutation = useDeleteHomestay();
  const homestays = response?.data || [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const handleDeleteConfirm = async () => {
    if (!homestayToDelete) return;
    try {
      await deleteMutation.mutateAsync(homestayToDelete.id);
      setHomestayToDelete(null);
      showToast.success(`"${homestayToDelete.name}" deleted.`);
    } catch (err) {
      showToast.error(errorMessage(err, "Failed to delete homestay."));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Homestays"
        subtitle="Manage traditional village homestays, rates, host profiles, and room capacities."
        actionText="Add New Homestay"
        actionHref="/homestays/new"
        actionIcon={<span className="text-base font-bold">+</span>}
      />

      {/* Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search homestay name, village..."
            className="admin-input py-1.5 text-xs w-72"
          />
          <button type="submit" className="admin-btn-primary py-1.5 text-xs">
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setSearchTerm("");
              }}
              className="admin-btn-ghost py-1.5 text-xs"
            >
              Reset
            </button>
          )}
        </form>

        <span className="text-xs text-admin-muted font-medium">
          {homestays.length} {homestays.length === 1 ? "homestay" : "homestays"} listed
        </span>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="admin-card p-12 text-center text-admin-muted text-sm flex items-center justify-center gap-3">
          <svg className="animate-spin h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading homestays...
        </div>
      )}

      {/* Empty state */}
      {!isLoading && homestays.length === 0 && (
        <div className="admin-card p-12 text-center text-admin-muted text-sm">
          No homestays found matching your criteria.
        </div>
      )}

      {/* Grid of Homestays */}
      {!isLoading && homestays.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {homestays.map((item) => (
            <div
              key={item.id}
              className="admin-card overflow-hidden flex flex-col justify-between group hover:border-gold/30 transition-all duration-200"
            >
              {/* Image banner */}
              <div className="h-44 w-full bg-admin-bg relative overflow-hidden">
                {item.images?.[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-admin-muted text-xs">
                    No image preview
                  </div>
                )}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-gold border border-gold/30">
                  NPR {item.pricePerNight?.toLocaleString()} / night
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-gold font-medium">
                    <span>📍</span>
                    <span>{item.village}, {item.region}</span>
                  </div>
                  <h3 className="text-base font-bold text-admin-text mt-1 group-hover:text-gold transition-colors">
                    {item.name}
                  </h3>
                  {item.hostName && (
                    <p className="text-xs text-admin-muted mt-1">
                      Hosted by <span className="text-admin-text font-medium">{item.hostName}</span>
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs text-admin-muted mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Badges / metadata */}
                <div className="pt-3 border-t border-admin-border flex flex-wrap items-center gap-2 text-[11px] text-admin-muted">
                  <span className="px-2 py-0.5 rounded bg-mist border border-admin-border">
                    {item.roomType || "PRIVATE"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-mist border border-admin-border">
                    Up to {item.capacity} guests
                  </span>
                  <span className="px-2 py-0.5 rounded bg-mist border border-admin-border">
                    {item.mealsIncluded?.replace("_", " ") || "BREAKFAST"}
                  </span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="px-5 py-3 border-t border-admin-border bg-admin-bg flex items-center justify-between">
                <Link
                  href={`/homestays/${item.id}`}
                  className="text-xs font-semibold text-gold hover:underline inline-flex items-center gap-1"
                >
                  ✎ Edit Homestay
                </Link>
                <button
                  type="button"
                  onClick={() => setHomestayToDelete(item)}
                  className="text-xs font-semibold text-red-400 hover:text-red-300 transition-colors p-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!homestayToDelete}
        title={`Delete "${homestayToDelete?.name}"?`}
        message="This will permanently delete this homestay and remove its availability. This action cannot be reversed."
        confirmText="Yes, Delete Homestay"
        confirmVariant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setHomestayToDelete(null)}
      />
    </div>
  );
}
