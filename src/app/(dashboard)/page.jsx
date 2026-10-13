"use client";

import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import DataTable from "@/components/shared/DataTable";
import { useStats } from "@/hooks/useStats";
import { useAllBookings } from "@/hooks/useBookings";

export default function DashboardOverviewPage() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: bookingsData, isLoading: bookingsLoading } = useAllBookings({
    limit: 6,
    page: 1,
  });

  const recentBookings = bookingsData?.data || [];

  const columns = [
    {
      header: "Guest",
      render: (row) => (
        <div>
          <p className="font-semibold text-admin-text">{row.user?.name || "Anonymous"}</p>
          <p className="text-xs text-admin-muted">{row.user?.email || "—"}</p>
        </div>
      ),
    },
    {
      header: "Homestay",
      render: (row) => (
        <div>
          <p className="font-medium text-admin-text">{row.homestay?.name || "Homestay"}</p>
          <p className="text-xs text-admin-muted">{row.homestay?.village || "Nepal"}</p>
        </div>
      ),
    },
    {
      header: "Dates",
      render: (row) => (
        <span className="text-xs font-mono text-admin-muted">
          {new Date(row.checkIn).toLocaleDateString()} → {new Date(row.checkOut).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Amount",
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
      header: "Action",
      className: "text-right",
      render: (row) => (
        <Link
          href={`/bookings/${row.id}`}
          className="text-xs font-semibold text-gold hover:underline"
        >
          View Details →
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        subtitle="Platform metrics, booking statuses, and quick management links."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value={
            statsLoading
              ? "..."
              : `NPR ${(stats?.totalRevenue || 0).toLocaleString()}`
          }
          subtitle="Confirmed & paid bookings"
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="Total Bookings"
          value={statsLoading ? "..." : (stats?.totalBookings ?? 0)}
          subtitle="Lifetime bookings"
          color="gold"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />

        <StatCard
          title="Pending Bookings"
          value={statsLoading ? "..." : (stats?.pendingBookings ?? 0)}
          subtitle="Awaiting payment/confirmation"
          color="terracotta"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="Active Homestays"
          value={statsLoading ? "..." : (stats?.totalHomestays ?? 0)}
          subtitle={`${stats?.totalUsers ?? 0} registered travelers`}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions Bar */}
      <div className="admin-card p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-sm text-admin-text">Quick Actions</h4>
          <p className="text-xs text-admin-muted mt-0.5">Frequently used operations</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/homestays/new"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-mist border border-admin-border hover:border-teal/50 hover:text-teal transition-colors inline-flex items-center gap-1.5"
          >
            <span>+</span> Add New Homestay
          </Link>
          <Link
            href="/village-guides/new"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-mist border border-admin-border hover:border-teal/50 hover:text-teal transition-colors inline-flex items-center gap-1.5"
          >
            <span>+</span> Add Village Guide
          </Link>
          <Link
            href="/bookings"
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-terracotta/20 text-terracotta border border-terracotta/30 hover:bg-terracotta hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            Manage All Bookings →
          </Link>
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-admin-text">Recent Bookings</h2>
          <Link href="/bookings" className="text-xs font-semibold text-gold hover:underline">
            View all bookings →
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={recentBookings}
          isLoading={bookingsLoading}
          emptyMessage="No recent bookings yet."
        />
      </div>
    </div>
  );
}
