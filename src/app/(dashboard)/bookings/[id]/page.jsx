"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import StatusBadge from "@/components/shared/StatusBadge";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { useBookingDetail, useConfirmBooking, useCancelBooking } from "@/hooks/useBookings";
import { showToast, errorMessage } from "@/lib/toast";

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: booking, isLoading, isError } = useBookingDetail(id);
  const confirmMutation = useConfirmBooking();
  const cancelMutation = useCancelBooking();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  if (isLoading) {
    return (
      <div className="p-12 text-center text-admin-muted text-sm flex items-center justify-center gap-3">
        <svg className="animate-spin h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Loading booking details...
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="space-y-4">
        <Link href="/bookings" className="text-xs text-gold hover:underline">
          ← Back to all bookings
        </Link>
        <div className="admin-card p-8 text-center text-admin-muted">
          Booking record not found or could not be loaded.
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    try {
      await confirmMutation.mutateAsync(id);
      showToast.success("Booking confirmed! Guest has been notified ✅");
    } catch (err) {
      showToast.error(errorMessage(err, "Failed to confirm booking."));
    }
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync({ id, reason: cancelReason });
      setIsCancelModalOpen(false);
      showToast.success("Booking cancelled.");
    } catch (err) {
      showToast.error(errorMessage(err, "Failed to cancel booking."));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link
          href="/bookings"
          className="text-xs font-semibold text-admin-muted hover:text-admin-text transition-colors"
        >
          ← Bookings
        </Link>
        <span className="text-admin-border">/</span>
        <span className="text-xs font-mono text-gold">#{booking.id.slice(-8)}</span>
      </div>

      <PageHeader
        title={`Booking #${booking.id.slice(-8)}`}
        subtitle={`Placed on ${new Date(booking.createdAt).toLocaleDateString()}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="admin-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-admin-border pb-4">
              <h3 className="font-semibold text-admin-text text-base">Reservation Summary</h3>
              <StatusBadge status={booking.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="admin-label">Check-in</span>
                <p className="font-semibold text-admin-text">
                  {new Date(booking.checkIn).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <span className="admin-label">Check-out</span>
                <p className="font-semibold text-admin-text">
                  {new Date(booking.checkOut).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <span className="admin-label">Guests</span>
                <p className="font-semibold text-admin-text">{booking.guests} Guests</p>
              </div>
            </div>

            <div className="pt-3 border-t border-admin-border flex items-center justify-between">
              <span className="text-sm font-medium text-admin-muted">Total Price</span>
              <span className="text-xl font-bold text-admin-text">
                NPR {booking.totalAmount?.toLocaleString()}
              </span>
            </div>

            <div className="pt-3 border-t border-admin-border text-sm space-y-1.5">
              <div className="flex justify-between">
                <span className="text-admin-muted">Payment Method</span>
                <span className="font-medium text-admin-text">
                  {booking.status === "PAID" || booking.status === "CONFIRMED" ? "eSewa Digital Wallet" : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-admin-muted">Transaction Ref</span>
                <span className="font-mono text-xs text-admin-text">{booking.paymentRef || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-admin-muted">Payment Status</span>
                {booking.status === "PAID" || booking.status === "CONFIRMED" ? (
                  <span className="text-emerald-400 font-semibold text-xs">✓ PAID</span>
                ) : (
                  <span className="text-gold font-semibold text-xs">Unpaid / Pending</span>
                )}
              </div>
            </div>

            {booking.cancelReason && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                <span className="font-semibold">Cancellation Note: </span>
                {booking.cancelReason}
              </div>
            )}
          </div>

          <div className="admin-card p-6 space-y-3">
            <h3 className="font-semibold text-admin-text text-base border-b border-admin-border pb-3">
              Homestay Destination
            </h3>
            <div>
              <h4 className="text-lg font-bold text-admin-text">
                {booking.homestay?.name || "Homestay Name"}
              </h4>
              <p className="text-sm text-admin-muted mt-0.5">
                {booking.homestay?.village ? `${booking.homestay.village}, ` : ""}
                {booking.homestay?.region || "Nepal"}
              </p>
            </div>
            {booking.homestay?.hostName && (
              <p className="text-xs text-admin-muted">
                <span className="text-gold font-medium">Host:</span> {booking.homestay.hostName}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card p-6 space-y-3">
            <h3 className="font-semibold text-admin-text text-base border-b border-admin-border pb-3">
              Guest Contact
            </h3>
            <div>
              <p className="text-xs text-admin-muted">Full Name</p>
              <p className="font-semibold text-admin-text text-sm mt-0.5">
                {booking.user?.name || "Anonymous Traveler"}
              </p>
            </div>
            <div>
              <p className="text-xs text-admin-muted">Email</p>
              <p className="text-sm text-admin-text mt-0.5">{booking.user?.email || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-admin-muted">Phone Number</p>
              <p className="text-sm text-admin-text mt-0.5">{booking.user?.phone || "—"}</p>
            </div>
          </div>

          <div className="admin-card p-6 space-y-3">
            <h3 className="font-semibold text-admin-text text-base border-b border-admin-border pb-3">
              Admin Actions
            </h3>

            {booking.status === "PAID" && (
              <button
                onClick={handleConfirm}
                disabled={confirmMutation.isPending}
                className="w-full py-2.5 px-4 rounded-lg bg-teal hover:bg-teal-dark text-white font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {confirmMutation.isPending ? "Confirming..." : "✓ Confirm Booking"}
              </button>
            )}

            {booking.status !== "CANCELLED" && (
              <button
                onClick={() => setIsCancelModalOpen(true)}
                disabled={cancelMutation.isPending}
                className="w-full py-2.5 px-4 rounded-lg bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-300 font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer"
              >
                ✕ Cancel Booking
              </button>
            )}

            {booking.status === "CONFIRMED" && (
              <p className="text-xs text-center text-emerald-400 font-medium">
                This booking has already been verified and confirmed.
              </p>
            )}

            {booking.status === "CANCELLED" && (
              <p className="text-xs text-center text-red-400 font-medium">
                This reservation was cancelled.
              </p>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isCancelModalOpen}
        title="Cancel This Reservation"
        message="Are you sure you want to cancel this booking? This will update the status and notify the guest."
        confirmText="Confirm Cancellation"
        confirmVariant="danger"
        isLoading={cancelMutation.isPending}
        onConfirm={handleCancel}
        onCancel={() => setIsCancelModalOpen(false)}
      >
        <div className="mt-3">
          <label className="admin-label">Cancellation Reason</label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="e.g., Requested by guest, homestay unavailable..."
            rows={3}
            className="admin-input text-xs"
          />
        </div>
      </ConfirmModal>
    </div>
  );
}
