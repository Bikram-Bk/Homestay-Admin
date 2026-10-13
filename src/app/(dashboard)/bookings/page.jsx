"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import DataTable from "@/components/shared/DataTable";
import { useAllBookings } from "@/hooks/useBookings";

const STATUS_TABS = [
  { label: "All Bookings", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Paid", value: "PAID" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function BookingsPage() {
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const { data: response, isLoading } = useAllBookings({
    status: selectedStatus === "ALL" ? undefined : selectedStatus,
    search: searchQuery || undefined,
    page,
    limit: 10,
  });

  const bookings = response?.data || [];
  const meta = response?.meta || { page: 1, totalPages: 1 };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
  };

  const columns = [
    {
      header: "Booking ID & Guest",
      render: (row) => (
        <div>
          <p className="font-semibold text-admin-text">{row.user?.name || "Guest"}</p>
          <p className="text-xs text-admin-muted">{row.user?.email || "—"}</p>
          <p className="text-[10px] font-mono text-admin-muted mt-0.5">#{row.id.slice(-8)}</p>
        </div>
      ),
    },
    {
      header: "Homestay / Village",
      render: (row) => (
        <div>
          <p className="font-medium text-admin-text">{row.homestay?.name || "Homestay"}</p>
          <p className="text-xs text-admin-muted">
            {row.homestay?.village ? `${row.homestay.village}, ` : ""}{row.homestay?.region || "Nepal"}
          </p>
        </div>
      ),
    },
    {
      header: "Check-in / Check-out",
      render: (row) => (
        <div>
          <p className="text-xs text-admin-text font-medium">
            {new Date(row.checkIn).toLocaleDateString()}
          </p>
          <p className="text-xs text-admin-muted">
            to {new Date(row.checkOut).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      header: "Guests",
      render: (row) => (
        <span className="text-xs font-medium text-admin-text">
          {row.guests} {row.guests === 1 ? "guest" : "guests"}
        </span>
      ),
    },
    {
      header: "Total (NPR)",
      render: (row) => (
        <span className="font-semibold text-admin-text">
          NPR {row.totalAmount?.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Payment",
      render: (row) =>
        row.status === "PAID" || row.status === "CONFIRMED" ? (
          <div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              eSewa
            </span>
            {row.paymentRef && (
              <p className="text-[10px] font-mono text-admin-muted mt-0.5">#{row.paymentRef}</p>
            )}
          </div>
        ) : (
          <span className="text-xs text-admin-muted">Unpaid</span>
        ),
    },
    {
      header: "Action",
      className: "text-right",
      render: (row) => (
        <Link
          href={`/bookings/${row.id}`}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap bg-mist border border-admin-border hover:border-teal/50 hover:text-teal transition-colors inline-block"
        >
          Manage →
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings Management"
        subtitle="Review, confirm, and manage customer homestay reservations."
      />

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-admin-card border border-admin-border overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setSelectedStatus(tab.value);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${selectedStatus === tab.value
                  ? "bg-mist text-teal border border-teal/40"
                  : "text-admin-muted hover:text-admin-text hover:bg-mist"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by guest name..."
            className="admin-input py-1.5 text-xs w-60"
          />
          <button type="submit" className="admin-btn-primary py-1.5 text-xs whitespace-nowrap">
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
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        isLoading={isLoading}
        emptyMessage="No bookings match the specified filters."
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
