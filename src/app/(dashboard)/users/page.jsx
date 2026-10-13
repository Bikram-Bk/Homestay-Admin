"use client";

import { useState } from "react";
import PageHeader from "@/components/shared/PageHeader";
import DataTable from "@/components/shared/DataTable";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { useUsers, useUser, useDeleteUser } from "@/hooks/useUsers";
import { showToast, errorMessage } from "@/lib/toast";

// Booking status badge styles (View modal ma use)
const STATUS_STYLES = {
  PENDING: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  PAID: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  CONFIRMED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  CANCELLED: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function UsersDirectoryPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // View & Delete modal states
  const [viewingUserId, setViewingUserId] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const { data: response, isLoading } = useUsers({
    search: searchQuery || undefined,
    page,
    limit: 15,
  });

  const deleteMutation = useDeleteUser();

  const users = response?.data || [];
  const meta = response?.meta || { page: 1, totalPages: 1 };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(deletingUser.id, {
      onSuccess: (res) => {
        setDeletingUser(null);
        const info = res?.data;
        showToast.success(
          info
            ? `Traveler deleted (with ${info.deletedBookings} bookings, ${info.deletedReviews} reviews).`
            : "Traveler deleted."
        );
      },
      onError: (err) => {
        showToast.error(errorMessage(err, "Failed to delete traveler."));
      },
    });
  };

  const columns = [
    {
      header: "Traveler",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 text-gold flex items-center justify-center font-bold text-xs">
            {row.name ? row.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <p className="font-semibold text-admin-text text-sm">{row.name || "Anonymous"}</p>
            <p className="text-xs text-admin-muted font-mono">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Phone",
      render: (row) => (
        <span className="text-xs text-admin-muted font-mono">
          {row.phone || "—"}
        </span>
      ),
    },
    {
      header: "Role",
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-mist border border-admin-border text-admin-text">
          {row.role}
        </span>
      ),
    },
    {
      header: "Total Bookings",
      render: (row) => (
        <span className="text-xs font-semibold text-gold">
          {row._count?.bookings ?? 0} {row._count?.bookings === 1 ? "booking" : "bookings"}
        </span>
      ),
    },
    {
      header: "Joined Date",
      render: (row) => (
        <span className="text-xs text-admin-muted">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setViewingUserId(row.id)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-mist border border-admin-border text-admin-text hover:border-teal/50 transition-colors cursor-pointer"
          >
            👁 View
          </button>
          <button
            onClick={() => setDeletingUser(row)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            🗑 Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Travelers Directory"
        subtitle="Registered travelers and customers on the Homestay Nepal platform."
      />

      {/* Search Input */}
      <div className="flex items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search traveler by name or email..."
            className="admin-input py-1.5 text-xs w-72"
          />
          <button type="submit" className="admin-btn-primary py-1.5 text-xs">
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setSearchQuery("");
                setPage(1);
              }}
              className="admin-btn-ghost py-1.5 text-xs"
            >
              Clear
            </button>
          )}
        </form>

        <span className="text-xs text-admin-muted">
          {meta.total ?? users.length} registered travelers
        </span>
      </div>

      <DataTable
        columns={columns}
        data={users}
        isLoading={isLoading}
        emptyMessage="No registered travelers found."
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* ── View Traveler Detail Modal ── */}
      {viewingUserId && (
        <UserDetailModal
          userId={viewingUserId}
          onClose={() => setViewingUserId(null)}
        />
      )}

      {/* ── Delete Confirm Modal ── */}
      <ConfirmModal
        isOpen={Boolean(deletingUser)}
        title="Delete Traveler?"
        message={`Delete ${deletingUser?.name || "this traveler"}? This will also permanently delete their ${
          deletingUser?._count?.bookings ?? 0
        } booking(s) and all their reviews. This action cannot be undone.`}
        confirmText="Yes, Delete Traveler"
        confirmVariant="danger"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingUser(null)}
      />
    </div>
  );
}

// Traveler Detail Modal — info + booking history
function UserDetailModal({ userId, onClose }) {
  const { data: user, isLoading } = useUser(userId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="admin-card w-full max-w-lg p-6 shadow-2xl border-admin-border bg-admin-card max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading || !user ? (
          <p className="text-sm text-admin-muted animate-pulse py-8 text-center">
            Loading traveler details...
          </p>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-4 pb-4 border-b border-admin-border">
              <div className="w-12 h-12 rounded-full bg-gold/15 border border-gold/30 text-gold flex items-center justify-center font-bold text-lg">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-admin-text truncate">{user.name}</h3>
                <p className="text-xs text-admin-muted font-mono truncate">{user.email}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-admin-muted hover:text-admin-text hover:bg-mist transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 py-4 border-b border-admin-border text-sm">
              <div>
                <p className="text-xs text-admin-muted">Phone</p>
                <p className="font-semibold text-admin-text font-mono text-xs mt-0.5">
                  {user.phone || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-admin-muted">Joined</p>
                <p className="font-semibold text-admin-text text-xs mt-0.5">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-admin-muted">Total Bookings</p>
                <p className="font-semibold text-gold text-xs mt-0.5">
                  {user._count?.bookings ?? 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-admin-muted">Reviews Written</p>
                <p className="font-semibold text-gold text-xs mt-0.5">
                  {user._count?.reviews ?? 0}
                </p>
              </div>
            </div>

            {/* Booking History */}
            <div className="pt-4">
              <h4 className="text-sm font-semibold text-admin-text mb-3">
                Recent Bookings {user.bookings?.length > 0 && `(${user.bookings.length})`}
              </h4>

              {user.bookings?.length === 0 ? (
                <p className="text-xs text-admin-muted py-3 text-center">
                  No bookings yet from this traveler.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {user.bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-lg bg-admin-bg border border-admin-border space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-admin-text truncate">
                          {b.homestay?.name || "Homestay"}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            STATUS_STYLES[b.status] || STATUS_STYLES.PENDING
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-admin-muted">
                        <span>
                          📍 {b.homestay?.village || "—"} •{" "}
                          {new Date(b.checkIn).toLocaleDateString()} →{" "}
                          {new Date(b.checkOut).toLocaleDateString()}
                        </span>
                        <span className="font-semibold text-gold">
                          NPR {b.totalAmount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
